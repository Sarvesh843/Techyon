import React, { useEffect, useState } from "react";
import axios from "axios";

const Table = () => {
  const [resdata, setResData] = useState([]);
  const [swornData, setSwornData] = useState({});

  useEffect(() => {
    axios({
      method: "get",
      url: "https://anapioficeandfire.com/api/houses",
    }).then(function (response) {
      setResData(response.data);
    });
  }, []);

  const getSwornData = (swornArray, index) => {
    Promise.all(
      swornArray.map((url) => {
        return axios.get(url).then((response) => response.data.name);
      })
    )
      .then((data) => {
        setSwornData((prevState) => ({
          ...prevState,
          [index]: data,
        }));
      })
      .catch((error) => {
        console.error("Error fetching sworn members data:", error);
      });
  };

  useEffect(() => {
    resdata.forEach((house, index) => {
      if (house.swornMembers.length > 0) {
        getSwornData(house.swornMembers, index);
      }
    });
  }, [resdata]);

  // console.log(resdata);

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>House</th>
            <th>Region</th>
            <th>Titles</th>
            <th>Sworn Members</th>
          </tr>
        </thead>
        <tbody>
          {resdata.map((val, key) => {
            return (
              <tr key={key}>
                <td>{val.name}</td>
                <td>{val.region}</td>
                <td>
                  {val.titles.length > 0 ? val.titles.join(", ") : "None"}
                </td>
                <td>{swornData[key] ? swornData[key].join(', ') : "None"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default Table;
