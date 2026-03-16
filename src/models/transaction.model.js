const mongooge = require('mongoose');

const transactionSchema = new mongooge.Schema({
    fromAccount: {
        type: mongooge.Schema.Types.ObjectId,
        ref: 'account',
        required: [true, 'From account is required'],
        index: true
    },
    toAccount: {
        type: mongooge.Schema.Types.ObjectId,
        ref: 'account',
        required: [true, 'To account is required'],
        index: true
    },
    amount: {
        type: mongooge.Schema.Types.Decimal128,
        required: [true, 'Amount is required'],
        min: [0.01, 'Amount must be at least 0.01']
    },
    status: {
        type: String,
        enum: {
            values: ['PENDING', 'COMPLETED', 'FAILED', 'REVERSED'],
            message: 'Status must be either PENDING, COMPLETED, FAILED, or REVERSED'
        },
        default: 'PENDING'
    },
    idempotencyKey: {
        type: String,
        required: [true, 'Idempotency key is required'],
        unique: true,
        index: true
    }
}
, { timestamps: true }
);


const transactionModel = mongooge.model('transaction', transactionSchema);

module.exports = transactionModel;