import Transaction from "../models/transation.model.js";

const transactionResolver = {

    Query: {
        transactions: async (_, __,context) => {
            try {
                
                if(!context.getUser()){
                    throw new Error("Unauthorized");
                }

                const userId = context.getUser()._id;
                const transactions = await Transaction.find({userId});

                return transactions;

            } catch (error) {
                console.error("Error in transactions : ", err);
				throw new Error(err.message || "Internal server error");
            }
        },
        transaction: async (_,{transactionId}) => {
            try {
                
                const transaction = await Transaction.findById(transactionId);
                return transaction;

            } catch (error) {
                console.error("Error in transaction : ", err);
				throw new Error(err.message || "Internal server error");
            }
        }
    },
    Mutation: {
        createTransaction: async (_,{input},context) => {
            try {
                
                const newTransaction = new Transaction({
                    ...input,
                    userId: context.getUser()._id
                })

                await newTransaction.save();
                
                return newTransaction;

            } catch (error) {
                console.error("Error in createTransaction : ", error);
				throw new Error(err.message || "Internal server error");
            }
        },
        updateTransaction: async (_,{input}) => {
            try {
                
                const updatedTransaction = await Transaction.findByIdAndUpdate(input.transactionId,input,{new:true});
                return updatedTransaction;

            } catch (error) {
                console.error("Error in updateTransaction : ", err);
				throw new Error(err.message || "Internal server error");
            }
        },
        deleteTransaction: async (_, { transactionId }) => {
			try {
				const deletedTransaction = await Transaction.findByIdAndDelete(transactionId);
				return deletedTransaction;
			} catch (err) {
				console.error("Error in deleteTransaction:", err);
				throw new Error("Error deleting transaction");
			}
		}
    }
}

export default transactionResolver;