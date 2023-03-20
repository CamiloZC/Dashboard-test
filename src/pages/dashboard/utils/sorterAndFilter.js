export const sortedDataByDate = (data) => {
    data.sort((a, b) => {
        const dateA = new Date(a.order_date);
        const dateB = new Date(b.order_date);
        return dateA - dateB;
    });
    return data;
};

export const getDaysAgoData = (data, daysAgo = 30) => {
    let t = new Date(); 
    let d = new Date(t.getFullYear(), t.getMonth(), t.getDate() - daysAgo);
    return sortedDataByDate(data.filter(item => new Date(item.order_date) >= d)); 
}

export const getrPrevDaysAgoData = (data) => {
    let t = new Date(); 
    let o = new Date(t.getFullYear(), t.getMonth(), t.getDate() - 30);
    let d = new Date(o.getFullYear(), o.getMonth(), o.getDate() - 30);
    return sortedDataByDate(data.filter(item => new Date(item.order_date) >= d).filter(item => new Date(item.order_date) < o));
}

export const newCustomerFilter = (data) => data.map((item) => {
    if (item.customer_type === "New"){
        return item;
    } else {
        return {};
    }
})

export const existingCustomerFilter = (data) => data.map((item) => {
    if (item.customer_type === "Existing"){
        return item;
    } else {
        return {};
    }
})
