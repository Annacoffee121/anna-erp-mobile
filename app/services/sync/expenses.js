import {transformSyncExpense, transformUpdateExpense} from "../../helpers/handover";
import {getOfflineExpenses, insertExpense} from "../../../database/Expenses/model";
import {postExpenses} from "../handover";

const getOfflineData = () => {
    return getOfflineExpenses().then(value => {
        return value.length ? value : [];
    }).catch(error => console.log(error))
};

export const syncAllExpenses = async () => {
    return await getOfflineData().then(async expenses => {
        await Promise.all(expenses.map(async expense => {
            await syncExpense(expense).then(result => {
                return result;
            });
        }));
    });
};

const syncExpense = async (expense) => {
    let mappedExpense = transformSyncExpense(expense);
    return await postExpenses(mappedExpense).then(async value => {
        const data = transformUpdateExpense(expense, value);
        insertExpense(data).then(res => console.log('Expense synced')).catch(er => console.log(er, '#Expense error'))
    }).catch(exception => {
        console.log(exception, 'Expense create exception')
    });
};