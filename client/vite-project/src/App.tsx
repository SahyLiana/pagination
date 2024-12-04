import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const ref = useRef<HTMLInputElement>(null);
  // const refSearch = useRef<HTMLInputElement>(null);

  const [pages, setPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<{ name: string; _id: string }[] | null>();

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (ref.current) {
      console.log("My input is:", ref.current?.value);

      const submitCall = await axios.post("http://localhost:3000/api/tasks", {
        name: ref.current.value,
      });

      console.log(submitCall.data);

      ref.current.value = "";
    }
  };

  useEffect(() => {
    const ApiCall = async () => {
      if (!search) {
        const getData = await axios.get(
          `http://localhost:3000/api/tasks?limit=2&skip=${(currentPage - 1) * 2}`
        );

        console.log(getData.data[0]);

        setPages(getData.data[0].totalCount[0].count / 2);
        setItems(getData.data[0].data);
      }
    };

    ApiCall();
  }, [currentPage, search]);

  console.log("pages are", pages);

  const searchFunction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (search) {
      console.log("My ref search is:", search);
      const getData = await axios.get(
        `http://localhost:3000/api/tasks?limit=2&skip=&name=${search}`
      );

      console.log(getData.data[0]);

      setPages(getData.data[0].data.length / 2);
      setItems(getData.data[0].data);
      // refSearch.current.value = "";
    }
  };

  return (
    <div>
      <h1>Pagination app</h1>
      <form onSubmit={submitForm}>
        <input required ref={ref} value={ref.current?.value} type="text" />
        <button>Add</button>
      </form>

      <form onSubmit={searchFunction}>
        <input
          type="text"
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
        />
        <button>Search</button>
      </form>
      {/**I used Array.from({ length: pages }) to generate an array of pages length, then mapped over that array to create page buttons. */}

      <table style={{ borderCollapse: "collapse", border: "solid 1px black" }}>
        <tr>
          <th style={{ border: "solid 1px black" }}>Id</th>
          <th style={{ border: "solid 1px black" }}>Name</th>
        </tr>
        {items &&
          items.map((item) => (
            <tr style={{ border: "solid 1px black" }}>
              <td style={{ border: "solid 1px black" }}>{item._id}</td>{" "}
              <td>{item.name}</td>
            </tr>
          ))}
      </table>

      {pages > 0 &&
        Array.from({ length: pages }, (_, index) => (
          <button onClick={() => setCurrentPage(index + 1)}>{index + 1}</button>
        ))}
    </div>
  );
}

export default App;
