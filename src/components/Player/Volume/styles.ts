import styled from "styled-components";

interface VolumeInputProps {
  percentage: number | string;
}

export const VolumeInput = styled.input`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  margin: 10px 0;
  background: transparent;
  border-radius: 50px;
  width: 120px;

  &:focus {
    outline: none;
  }

  &::-webkit-slider-runnable-track {
    height: 5px;
    cursor: pointer;
    background: ${(props: VolumeInputProps) =>
      `linear-gradient(to right, #5555df ${props.percentage}%, #7d7d7d ${props.percentage}%)`};
    border-radius: 50px;
  }

  &::-moz-range-track {
    height: 5px;
    cursor: pointer;
    background: ${(props: VolumeInputProps) =>
      `linear-gradient(to right, #5555df ${props.percentage}%, #7d7d7d ${props.percentage}%)`};
    border-radius: 50px;
  }

  &::-webkit-slider-thumb {
    box-shadow: 0px 0px 0px #000000;
    border: 1px solid #000;
    height: 14px;
    width: 14px;
    border-radius: 25px !important;
    background: linear-gradient(to top right, #ddd 25%, #fff);
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -4px;
    display: none;
    border: none;
  }

  &::-moz-range-thumb {
    box-shadow: 0px 0px 0px #000000;
    border: 1px solid #000;
    height: 14px;
    width: 14px;
    border-radius: 25px;
    background: linear-gradient(to top right, #ddd 25%, #fff);
    cursor: pointer;
    -moz-appearance: none;
    margin-top: -4px;
    visibility: hidden;
    border: none;
  }

  &:hover::-webkit-slider-thumb {
    display: block;
  }

  &:hover::-moz-range-thumb {
    visibility: visible;
  }
`;
