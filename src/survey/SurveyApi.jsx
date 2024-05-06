import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_ENDPOINT;

const getNextQuestion = () => {
  return axios.get(`${apiUrl}/survey/nextQuestion`, {
    params: {
      questionIndex: 0,
      followUpIndex: 1,
      selectedOption: 0,
      option1Duration: 30,
      option2Duration: 30
    }
  });
  
};

export { getNextQuestion };