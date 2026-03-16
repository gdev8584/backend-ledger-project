const mongoose = require('mongoose');
const ledgerModel = require('./ledger.model');

const accountSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : [true, 'Account must belong to a user'],
        index: true
    },
    status : {
        type : String,
        enum : {
            values : ['ACTIVE', 'FROZEN', 'CLOSED'],
            message : 'Status must be either ACTIVE, FROZEN, or CLOSED',
        },
        default : 'ACTIVE',
        required : [true, 'Account status is required']
    },
    currency: {
        type: String,
        required: [true, 'Currency is required'],
        default: 'INR'
    }
}
, { timestamps: true });

accountSchema.index({ user: 1, status: 1 });

accountSchema.methods.getBalance = async function() {
    const balanceData = await ledgerModel.aggregate([
        { $match: { account: this._id } },
        { $group: {
            _id: '$null',
            totalDebit: { $sum: { $cond: [{ $eq: ['$type', 'DEBIT'] }, '$amount', 0] } },
            totalCredit: { $sum: { $cond: [{ $eq: ['$type', 'CREDIT'] }, '$amount', 0] } }
        }}
        , { $project: {
            balance: { $subtract: ['$totalCredit', '$totalDebit'] }
        }}
    ]);
    return balanceData.length > 0 ? parseFloat(balanceData[0].balance) : 0;
}
const accountModel = mongoose.model('account', accountSchema);

module.exports = accountModel;