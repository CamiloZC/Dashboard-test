const actions = {
    UPDATE_DATA: 'UPDATE-DATA',
    updateData : (parsedData) => {
        return{
          type: actions.UPDATE_DATA,
          payload: parsedData
        }
    }    
};

export default actions;

