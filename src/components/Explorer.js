import React, { useState, useEffect } from "react";
import "../css/Explorer.css";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

function Explorer() {
  const [directories, setDirectories] = useState([]);
  const [current_directory, setCurrentDirectory] = useState("");
  const [error_message, set_error] = useState(null);
  const [flow_path, set_flow_path] = useState([""]);
  const [selected_item, set_selected_item] = useState([]);
  const [isSelected, set_isSelected] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const TOKEN =
    "sl.BUDNyYuXiPlCY80UWTslYjeRyoNW1H6wsp6cqFHI6obLh5TmRR1YtbnqJvf6jBAYRi6ZEmlP55MRfEZccFYZuOPfCoqpb_tmqt3NJBfJ_UMB9j3i4t9RGLM0HFzm8qS4cBY7mFJefamw";

  const delete_this = (used_path) => {
    fetch("https://api.dropboxapi.com/2/files/delete_v2", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        path: used_path,
      }),
    }).then((response) => {
      if (response.ok) {
        set_isSelected("");
        getDirectories(current_directory);
      } else {
        console.log(response.error);
      }
    });
  };

  const create_folder = (used_path) => {
    fetch("https://api.dropboxapi.com/2/files/create_folder_v2", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + TOKEN,
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        path: used_path,
        autorename: true,
      }),
    }).then((response) => {
      if (response.ok) {
        getDirectories(current_directory);
        setModalShow(false);
        setNewFolderName("");
      } else {
        console.log(response.error);
      }
    });
  };

  const getDirectories = (used_path) => {
    fetch("https://api.dropboxapi.com/2/files/list_folder", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        path: used_path,
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          response.status === 401 &&
            set_error("Token Expired") &&
            setDirectories([]);
        }
      })
      .then((data) => {
        console.log(data.entries);
        setDirectories(data.entries);
      })
      .catch((error) => {
        console.log(error);
      });
    if (error_message === "Token Expired") {
      setDirectories([]);
    }
    set_isSelected("");
    console.log(flow_path);
    console.log(current_directory);
    console.log(selected_item);
  };

  useEffect(() => getDirectories(current_directory), [current_directory]);

  useEffect(
    () => setCurrentDirectory(flow_path[flow_path.length - 1]),
    [flow_path]
  );
  useEffect(() => console.log(selected_item), [selected_item]);

  const handle_go_back = () => {
    set_flow_path((flow_path) => flow_path.slice(0, -1));
  };

  return (
    <div className="site-explorer">
      <Modal
        show={modalShow}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Create Folder
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h6>Name</h6>
          <input
            id="location"
            value={newFolderName}
            placeholder="Folder Name"
            onChange={(e) => setNewFolderName(e.target.value)}
            style={{ width: "100%" }}
            type="text"
          ></input>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setModalShow(false)}>Cancel</Button>
          {newFolderName !== "" && (
            <Button
              onClick={() =>
                create_folder(current_directory + "/" + newFolderName)
              }
            >
              Create
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {error_message && (
        <div>
          <p style={{ fontSize: "40px", fontWeight: "bold" }}>
            {error_message}
          </p>
        </div>
      )}
      <div className="dir_tree">
        <button className="dir_button" onClick={() => set_flow_path([""])}>
          Home
        </button>
        {flow_path.length !== 1 && (
          <button className="dir_button" onClick={handle_go_back}>
            Back
          </button>
        )}
      </div>
      <div className="dir_tree">
        <button className="dir_button" onClick={() => setModalShow(true)}>
          Create Folder
        </button>

        <div className="vl"></div>
        {isSelected !== "" && (
          <div className="fun_tree">
            <button
              className="dir_button"
              onClick={() => delete_this(selected_item["path_display"])}
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="folder">
        {error_message !== "Token Expired" && (
          <h4 className="current_dir_path">Dropbox{current_directory}</h4>
        )}
        {directories.length !== 0 && (
          <Table responsive>
            <thead>
              <tr>
                <th></th>
                <th style={{ textAlign: "left", fontSize: "18px" }}>Name</th>
                <th style={{ textAlign: "left", fontSize: "18px" }}>Type</th>
                <th style={{ textAlign: "left", fontSize: "18px" }}>Path</th>
              </tr>
            </thead>
            <tbody>
              {directories.map((item) => (
                <tr key={item["id"]}>
                  <td>
                    <input
                      id={item["id"]}
                      type="checkbox"
                      checked={isSelected === item["id"]}
                      onChange={() => {
                        if (isSelected === item["id"]) {
                          set_isSelected("");
                          set_selected_item([]);
                        } else {
                          set_isSelected(item["id"]);
                          set_selected_item(item);
                        }
                      }}
                    />
                  </td>
                  <td className="name_td">
                    <button
                      className="dir_button"
                      onClick={() =>
                        item[".tag"] !== "file" &&
                        set_flow_path((flow_path) => [
                          ...flow_path,
                          item["path_display"],
                        ])
                      }
                    >
                      {item["name"]}
                    </button>
                  </td>

                  <td style={{ textAlign: "left" }} className="dir_type">
                    {item[".tag"]}
                  </td>
                  <td className="dir_path">{item["path_display"]}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </div>
  );
}

export default Explorer;
