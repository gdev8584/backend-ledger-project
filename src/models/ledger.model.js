const mongoose = require('mongoose');

const ledgerSchema = new mongoose.Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'account',
        required: [true, 'Ledger entry must be associated with an account'],
        index: true,
        immutable: true
    },
    transaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'transaction',
        required: [true, 'Ledger entry must be associated with a transaction'],
        index: true,
        immutable: true
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required for ledger entry'],
        immutable: true
    },
    type: {
        type: String,
        enum: {
            values: ['DEBIT', 'CREDIT'],
            message: 'Type must be either DEBIT or CREDIT'
        },
        required: [true, 'Ledger entry type is required'],
        immutable: true
    }
}, { timestamps: true
})

function preventLedgerModification(next) {
    throw new Error('Ledger entries cannot be modified or deleted');
}

ledgerSchema.pre('updateOne', preventLedgerModification); // single source of truth for updates
ledgerSchema.pre('deleteOne', preventLedgerModification);
ledgerSchema.pre('findOneAndUpdate', preventLedgerModification);
ledgerSchema.pre('findOneAndDelete', preventLedgerModification);
ledgerSchema.pre('updateMany', preventLedgerModification);
ledgerSchema.pre('deleteMany', preventLedgerModification);
ledgerSchema.pre('remove', preventLedgerModification);
ledgerSchema.pre('findOneAndReplace', preventLedgerModification);

const ledgerModel = mongoose.model('ledger', ledgerSchema);

module.exports = ledgerModel;