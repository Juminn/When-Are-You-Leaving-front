import React from "react";
import styled from "styled-components";

const SettingsContainer = styled.div`
  padding: 30px 10px 0px 10px;
  border: 1px solid #ccc;
  width: 400px;

  background-color: #f9f9f9;

  display: ${(props) => (props.show ? "block" : "none")};
`;

const Field = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
`;

const Input = styled.input`
  padding: 10px 10px;
  width: 350px;
  border-radius: 6px;
  border: 2px solid #ccc;
  margin-left: 10px;
`;

const labelMap = {
  subwayCost: "시간당 지하철 비용",
  busCost: "시간당 버스 비용",
  walkingCost: "시간당 걷기 비용",
  transferCost: "환승 1회 비용",
};

const SettingField = ({ label, name, value, onChange }) => (
  <Field>
    <Label>{label}</Label>
    <Input type="number" name={name} value={value} onChange={onChange} />
  </Field>
);

const DetailSettings = ({ show, settings, setSettings }) => {
  const handleChange = (e) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <SettingsContainer show={show}>
      {/* <h3>대중교통 별 시간당 비용 입력</h3> */}
      {Object.entries(settings).map(([key, value]) => (
        <SettingField
          key={key}
          label={labelMap[key]}
          name={key}
          value={value}
          onChange={handleChange}
        />
      ))}
    </SettingsContainer>
  );
};

export default DetailSettings;
