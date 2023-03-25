import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";

const AxiosCrud = () => {
  const [data, setData] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [editing, setEditing] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [toggleButton, setToggleButton] = useState(true);
  const [errorTextName, setErrorTextName] = useState("");
  const [errorTextEmail, setErrorTextEmail] = useState("");
  const [errorTextPhone, setErrorTextPhone] = useState("");
  const [errorInputName, setErrorInputName] = useState(false);
  const [errorInputEmail, setErrorInputEmail] = useState(false);
  const [errorInputPhone, setErrorInputPhone] = useState(false);
  const [errorFormBorder, setErrorFormBorder] = useState(false);
  let URL = `http://localhost:4000/users`;

  const handleGetData = () => {
    axios
      .get(URL)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  useEffect(() => {
    handleGetData();
  }, []);

  console.log("data", data);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (formData?.name?.length > 0) {
      setErrorTextName("");
      setErrorInputName(false);
    }

    if (formData?.email?.length > 0) {
      setErrorTextEmail("");
      setErrorInputEmail(false);
    }

    if (formData?.phone?.length > 0 && formData?.phone?.length === 10) {
      setErrorTextPhone("");
      setErrorInputPhone(false);
    }
    if (formData.name && formData.email && formData.phone) {
      setErrorFormBorder(false);
    }

    // if (!/^[[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formData.email)) {
    //   setErrorTextEmail("Please enter valid email");
    //   setErrorInputEmail(true);
    // }

    // if (formData.phone.length !== 10) {
    //   setErrorTextPhone("Enter 10 digit number");
    //   setErrorInputPhone(true);
    // }
  };

  const handleAdd = () => {
    if (formData.name && formData.email && formData.phone) {
      axios
        .post(URL, {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        })
        .then((response) => {
          setData([...data, response.data]);
          setFormData({ name: "", email: "", phone: "" });
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
  };

  const handleEditToggle = (item) => {
    setFormData({
      id: item.id,
      name: item.name,
      email: item.email,
      phone: item.phone,
    });
    setEditing(false);
  };

  const handleEdit = () => {
    if (formData.name && formData.email && formData.phone) {
      axios
        .put(`${URL}/${formData.id}`, {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        })
        .then((response) => {
          setFormData({
            id: "",
            name: "",
            email: "",
            phone: "",
          });
          setEditing(true);
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
    handleGetData();
  };

  const handleDelete = (id) => {
    axios
      .delete(`${URL}/${id}`)
      .then((response) => {
        setData(data.filter((data) => data.id !== id));
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <>
      <h1>Axios CRUD App</h1>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div className={errorFormBorder ? "form-div-error" : "form-div"}>
            <h2>Add Details</h2>
            <form>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className={errorInputName ? "input-error-name" : "input-normal"}
              />
              <p className="error-text">{errorTextName}</p>
              <br />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className={
                  errorInputEmail ? "input-error-email" : "input-normal"
                }
              />
              <p className="error-text">{errorTextEmail}</p>
              <br />
              <input
                type="number"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                minLength="10"
                className={
                  errorInputPhone ? "input-error-phone" : "input-normal"
                }
              />
              <p className="error-text-phone">{errorTextPhone}</p>
              <br />
              {editing ? (
                <button type="button" className="add-btn" onClick={handleAdd}>
                  Add
                </button>
              ) : (
                <button
                  type="button"
                  className="update-btn"
                  onClick={handleEdit}
                >
                  Update
                </button>
              )}
            </form>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "25px",
          }}
        >
          {data.length > 0 ? (
            <div>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.name}</td>
                      <td>{item.email}</td>
                      <td>{item.phone}</td>
                      <td>
                        <button
                          className="edit-btn"
                          onClick={() => handleEditToggle(item)}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default AxiosCrud;
