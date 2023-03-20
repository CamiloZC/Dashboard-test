import dataActions from 'redux/data-reducer/actions';
import { useDispatch } from 'react-redux';
import Papa from 'papaparse';
import { useMemo } from 'react';

const { updateData } = dataActions;

export const useData = () => {
    const dispatch = useDispatch();
    useMemo(() => {
        const csvFilePath = require('../pages/dashboard/data/revenue-by-date-full.csv');
        Papa.parse(csvFilePath, {
            header: true,
            download: true,
            skipEmptyLines: true,
            complete: function (results) {
                const dataP = results.data;
                dispatch(updateData(dataP));
            }
        });
    }, [dispatch]);
}