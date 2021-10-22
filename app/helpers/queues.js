import {handelAutoSyncStatus} from "../actions/orders";
import {syncAll as syncAllOrder} from "../services/sync/order";
import {syncAll as syncAllInvoice} from "../services/sync/invoice";
import {syncAllPayment} from "../services/sync/payment";
import {syncAllExpenses} from "../services/sync/expenses";
import {syncAllRetChPayments} from "../services/sync/returnedCheque";

export const handleQueues = (store) => {
    store.dispatch(handelAutoSyncStatus(true));
    this.syncOrderData(store);
};

syncOrderData = (store) => {
    syncAllOrder().then(() => {
        this.syncInvoiceData(store);
    }).catch(error => {
        store.dispatch(handelAutoSyncStatus(false));
        console.warn(error)
    });
};

syncInvoiceData = (store) => {
    syncAllInvoice().then(() => {
        this.syncPaymentData(store);
    }).catch(error => {
        store.dispatch(handelAutoSyncStatus(false));
        console.warn(error)
    });
};

syncPaymentData = (store) => {
    syncAllPayment().then(() => {
       this.syncReturnChequesPayment(store)
    }).catch(error => {
        store.dispatch(handelAutoSyncStatus(false));
        console.warn(error)
    });
};

syncReturnChequesPayment = (store) => {
    syncAllRetChPayments().then(() => {
        this.syncExpensesData(store)
    }).catch(error => {
        store.dispatch(handelAutoSyncStatus(false));
        console.warn(error)
    });
};

syncExpensesData = (store) => {
    syncAllExpenses().then(() => {
        console.log('done');
        store.dispatch(handelAutoSyncStatus(false));
        //TODO Show notification
    }).catch(error => {
        store.dispatch(handelAutoSyncStatus(false));
        console.warn(error)
    });
};
