import {
    addReplacedStock, getReplacedStockById, getSoldStockById,
    updateSoldStock
} from "../../../database/Products/controller";

export const addSoldStock = (order_items) => {
    return order_items.map(item => {
        let pro_id = item.id ? item.id : item.product_id;
        getSoldStockById(pro_id).then(sold_stock => {
            let quantity = sold_stock + parseInt(item.quantity);
            updateSoldStock(pro_id, quantity).then(value => {
                // console.log(value)
            }).catch(error => console.warn(error))
        }).catch(error => console.warn(error))
    })
};

export const addAllReplacedStock = (return_products) => {
    return return_products.map(item => {
        getReplacedStockById(item.product_id).then(replaced_stock => {
            let quantity = replaced_stock + parseInt(item.qty);
            addReplacedStock(item.product_id, quantity).then(value => {
                // console.log(value)
            }).catch(error => console.warn(error))
        }).catch(error => console.warn(error))
    })
};

export const updateAllSoldStock = (old_order_items, new_order_items) => {
    // console.log(old_order_items, new_order_items, 'old_order_items, new_order_items')
    if (old_order_items.length && new_order_items.length) {
        new_order_items.map(item => {
            let pro_id = item.id ? item.id : item.product_id;
            let found = old_order_items.find(function (element) {
                return element.product_id === pro_id;
            });
            if (found){
                remove(old_order_items,found)
            }
            const foundQty = found ? found.quantity : 0;
            getSoldStockById(pro_id).then(sold_stock => {
                let quantity = (sold_stock - foundQty) + parseInt(item.quantity);
                updateSoldStock(pro_id, quantity).then(value => {
                    // console.log(value)
                }).catch(error => console.warn(error))
            }).catch(error => console.warn(error));
        });
        if (old_order_items.length){
            old_order_items.map(old_order_item=>{
                getSoldStockById(old_order_item.product_id).then(sold_stock => {
                    let quantity = sold_stock - old_order_item.quantity;
                    updateSoldStock(old_order_item.product_id, quantity).then(value => {
                        // console.log(value, '*value')
                    }).catch(error => console.warn(error))
                }).catch(error => console.warn(error));
            });
        }

    }
};

function remove(array, element) {
    const index = array.indexOf(element);
    array.splice(index, 1);
}