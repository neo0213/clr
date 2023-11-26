import { Button, Navbar as NavbarBs } from "react-bootstrap";
import React from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <>
      <NavbarBs sticky="top" className="container d-flex justify-content-between align-items-center mb-4" style={{backgroundColor: "#FFFFFF" }}>
        <NavLink to={`/`} className="h1">CLR</NavLink>
        <div class="search-container">
          <input
            className="p-3 search-bar"
            type="text"
            placeholder="Search for an item"
          />
          <span class="search-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon icon-tabler icon-tabler-search"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
              <path d="M21 21l-6 -6"></path>
            </svg>
          </span>
        </div>
        <NavLink to={`/messages`}>Messages</NavLink>
        <div>Profile</div>
        <NavLink to={`/cart`}>
          <Button style={{ width: "3rem", height: "3rem", position: "relative" }}>
            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
              <path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/>
            </svg>
            {/* <div className="rounded-circle bg-danger d-flex justify-content-center align-items-center">3</div> */}
          </Button>
        </NavLink>
      </NavbarBs>
    </>
  );
}

export default Navbar;
