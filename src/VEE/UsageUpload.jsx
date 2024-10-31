import { useState } from 'react';
import Papa from 'papaparse';

const allowedExtensions = ['csv'];
const UsageUpload = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [file, setFile] = useState('');

  const handleFileChange = (e) => {
    setError('');

    if (e.target.files.length) {
      const inputFile = e.target.files[0];

      const fileExtension = inputFile?.type.split('/')[1];
      if (!allowedExtensions.includes(fileExtension)) {
        setError('Please input a csv file');
        return;
      }

      setFile(inputFile);
    }
  };
  const handleParse = () => {
    if (!file) return alert('Enter a valid file');

    const reader = new FileReader();

    reader.onload = async ({ target }) => {
      const csv = Papa.parse(target.result, {
        header: true,
      });
      const parsedData = csv?.data;
      const rows = Object.keys(parsedData[0]);

      const columns = Object.values(parsedData[0]);
      const res = rows.reduce((acc, e, i) => {
        return [...acc, [[e], columns[i]]];
      }, []);
      console.log(res);
      setData(res);
    };
    reader.readAsText(file);
  };

  const handleClearData = () => {
    setData([]);
  };

  return (
    <div className="mt-4">
      <input
        onChange={handleFileChange}
        id="csvInput"
        name="file"
        type="File"
      />
      <div className="my-2">
        <button className="btn btn-primary mme-2" onClick={handleParse}>
          Parse
        </button>
        <button className="btn btn-danger ms-2" onClick={handleClearData}>
          Clear
        </button>
      </div>
      <div style={{ marginTop: '3rem' }}>
        {error
          ? error
          : data.map((e, i) => (
              <div key={i} className="item">
                {e[0]}:{e[1]}
              </div>
            ))}
      </div>
    </div>
  );
};

export default UsageUpload;
