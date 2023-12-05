import axios from "axios";
import React, { useEffect, useState } from "react";

type Card = {
  image: string;
  name: string;
  description: string;
  description2: string;
  date: string;
  id: number;
};

function Table() {
  const [cards, setCards] = useState<Card[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [description2, setDescription2] = useState("");
  const [editId, setEditId] = useState(-1);
  const [uname, setUname] = useState("");
  const [udescription, setUdescription] = useState("");
  const [udescription2, setUdescription2] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3000/cards").then((res) => setCards(res.data));
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios
      .post("http://localhost:3000/cards", {
        name: name,
        description: description,
        description2: description2,
        date: new Date(),
      })
      .then(() => {
        location.reload();
      });
  };

  const handleDelete = (id: number) => {
    axios.delete(`http://localhost:3000/cards/${id}`).then(() => {
      location.reload();
    });
  };

  const handleEdit = (id: number) => {
    axios.get(`http://localhost:3000/cards/${id}`).then((res) => {
      setUname(res.data.name);
      setUdescription(res.data.description);
      setUdescription2(res.data.description2);
    });
    setEditId(id);
  };

  const handleUpdate = (id: number) => {
    axios
      .put(`http://localhost:3000/cards/${id}`, {
        name: uname,
        description: udescription,
        description2: udescription2,
      })
      .then(() => {
        setCards(
          cards.map((card) =>
            card.id === id
              ? {
                  ...card,
                  name: uname,
                  description: udescription,
                  description2: udescription2,
                }
              : card
          )
        );
        setEditId(-1);
      });
  };

  return (
    <div className="content-wrapper">
      <div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            required
            placeholder="city"
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            required
            placeholder="country"
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="text"
            required
            placeholder="description"
            onChange={(e) => setDescription2(e.target.value)}
          />
          <button>Add</button>
        </form>
      </div>

      <div className="card-wrapper">
        {cards.map(({ image, name, description, description2, date, id }) => (
          <div key={id} className="card">
            {id === editId ? (
              <>                
                <input
                  type="text"                  
                  value={uname}
                  onChange={(e) => setUname(e.target.value)}
                />
                <input
                  type="text"                  
                  value={udescription}
                  onChange={(e) => setUdescription(e.target.value)}
                />
                <input
                  type="text"                  
                  value={udescription2}
                  onChange={(e) => setUdescription2(e.target.value)}
                />
                <button onClick={() => handleUpdate(id)}>Update</button>
              </>
            ) : (
              <>
                <img src={image} alt="name" width={200} id="image" />
                <h2>{name}</h2>
                <h4>{description}</h4>
                <h4>{description2}</h4>
                <h6>{date}</h6>
                <button onClick={() => handleDelete(id)}>Delete</button>
                <button onClick={() => handleEdit(id)}>Edit</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Table;
