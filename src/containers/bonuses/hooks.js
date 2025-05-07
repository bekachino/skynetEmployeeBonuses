import { useState } from "react";
import axiosApi from "../../axiosApi";
import { formatDate } from "../../utils";

export const useFetchLastPays = () => {
  const [lastPays, setLastPays] = useState([]);
  const [lastPaysLoading, setLastPaysLoading] = useState(false);
  
  const fetchLastPays = async (square_id) => {
    if (!square_id) return;
    
    try {
      setLastPaysLoading(true);
      const req = await axiosApi(`/v2/squares-noactive-pay/?squares_id=${square_id}`);
      const res = await req.data;
      setLastPays(res?.data || []);
      setLastPaysLoading(false);
    } catch (e) {
      console.log(e);
    }
  }
  
  return {
    lastPays,
    lastPaysLoading,
    fetchLastPays
  };
};

export const useFetchDataByAllSquares = () => {
  const [dataBySquaresLoading, setDataBySquaresLoading] = useState(false);
  const [dataBySquares, setDataBySquares] = useState([]);
  
  const percentageChange = (i, value) => {
    const listCopy = [...dataBySquares];
    dataBySquares[i].percentage = value || 90;
    setDataBySquares(listCopy);
  };
  
  const fetchDataBySquares = async (squares = [], date) => {
    setDataBySquaresLoading(true);
    setDataBySquares([]);
    
    for (const square of squares) {
      try {
        const formData = new FormData();
        formData.append('date_filter', formatDate(new Date(date)));
        formData.append('squares_id', square.id);
        const req = await axiosApi.post('v2/squares-filter/', formData);
        const res = await req.data;
        const reqForLastPays = await axiosApi(`/v2/squares-noactive-pay/?squares_id=${square.id}`);
        const sastPays = await reqForLastPays.data;
        
        setDataBySquares(prevState => (
          [
            ...prevState,
            {
              squares: squares.find((sq) => sq.id === square.id),
              aab: res.count['Актив'] || 0,
              nab: res.count['Неактив'] || 0,
              oab: (
                res.count['Неактив'] || 0
              ) + (
                res.count['Актив'] || 0
              ),
              aabPercentage: (
                (
                  (
                    res.count['Актив'] || 0
                  ) / (
                    res.count['Актив'] + res.count['Неактив'] || 0
                  )
                ) * 100
              ).toFixed(2) || 0,
              otkl_percentage: Number((
                (
                  res.count['Актив'] || 0
                ) / (
                  res.count['Актив'] + res.count['Неактив'] || 0
                )
              ) * 100 - 90).toFixed(2) || 0,
              otkl_kolvo: Number((
                (
                  (
                    (
                      (
                        res.count['Актив'] + res.count['Неактив'] || 0
                      ) / 100
                    ) * 90
                  ) / 100
                ) * Number((
                  (
                    res.count['Актив'] || 0
                  ) / (
                    res.count['Актив'] + res.count['Неактив'] || 0
                  )
                ) * 100 - 90)
              ).toFixed()) || 0,
              locations: res.locations.join(', '),
              percentage: 90,
              lastPaysCount: (
                sastPays?.data || []
              ).length
            }
          ]
        ));
      } catch (e) {
        setDataBySquaresLoading(false);
        console.log(e);
      }
    }
    setDataBySquaresLoading(false);
  };
  
  return {
    dataBySquares,
    dataBySquaresLoading,
    fetchDataBySquares,
    percentageChange
  };
};
