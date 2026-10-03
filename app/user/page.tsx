import React from "react";

const UsersPage = async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  const users = await res.json();
  return (
    <>
      <h1></h1>
    </>
  );
};

export default UsersPage;
