// AddressInput.js
import React from "react";
import styled from "styled-components";

const InputContainer = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 10;
`;

const AddressInputField = styled.input`
  padding: 10px 20px;
  border-radius: 4px;
`;

const AddressInput = ({ address, setAddress, onSearch }) => {
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onSearch(address);
    }
  };

  return (
    <InputContainer>
      <AddressInputField
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="주소 입력 후 Enter"
      />
    </InputContainer>
  );
};

export default AddressInput;
