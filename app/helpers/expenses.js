export const transformExpensesType = (expenses_types) => {
    if (!expenses_types.length) return [];
    return transformData(expenses_types);
};

function transformData(expenses_types) {
    let newData = [];
    expenses_types.map(expenses_type => {
        let new_expenses_type = {};
        new_expenses_type.value = expenses_type.name;
        new_expenses_type.id = expenses_type.value;
        new_expenses_type.type = expenses_type.type;
        newData.push(new_expenses_type);
    });
    return newData;
}