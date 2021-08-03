import api from './api';

const PORT = 3000;

api.listen(PORT, () => {
  console.info(`Server is running on port: ${PORT}`);
});