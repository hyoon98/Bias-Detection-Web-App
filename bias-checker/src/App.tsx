import { useRef, useState } from 'react'
import axios from 'axios'

function App() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [Message,setMessage] = useState<string|null>("No Message")
  const [file,setFile] = useState<Blob>(new Blob());
  const [downloadLink, setDownloadLink] = useState<string|undefined>("");
    const getBias = async ()=>{
      if(inputRef.current?.value!==""){
        const requestOptions = {headers:{"Content-Type":'application/json'},method:'POST',body:JSON.stringify({text:inputRef.current?.value})}
        const response = await fetch('http://localhost:5000/bias-detection',requestOptions)
        const data = await response.json()
        setMessage(`Result: ${data[0].label}, Accuracy: ${data[0].score}`)
      }
      else{
        setMessage("No text submitted")
      }
    }

    const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        setFile(e.target.files[0]);
      }
    }

    const removeBias = async () => {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const response = await axios.post('http://localhost:5000/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log(response.data);
        setDownloadLink(`data:text/csv;charset=utf-8,${encodeURIComponent(response.data.data)}`);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }

    return (
      <div className='flex flex-col justify-center items-center w-screen space-y-5'>
          <h1>Bias Checker</h1>
          <p>Check the bias of your news source article names</p>
          <div className='flex space-x-3'>
            <input className='w-[400px]' ref={inputRef} type='text' placeholder='Enter text'/>
            <button onClick={getBias}>Check Bias</button>
          </div>
          <p>{Message}</p>
          <div className='text-2xl'>
            OR
          </div>
          <div className='flex flex-col justify-center items-center space-y-5 bg-sky-950 p-10 rounded-xl w-fit'>
            <h2 className='text-2xl'>
              Upload a headerless CSV file with text, and remove biased entries
            </h2>
            <div className='flex items-center space-x-3'>
              <input className='w-[300px]' accept='.csv' onChange={uploadFile} type='file' placeholder='Enter a name'/>
              <button onClick={removeBias}>Remove Bias</button>
            </div>
            {
              <a href={downloadLink} download="processed_data.csv" className={`${(downloadLink&&downloadLink?.length>0)?"":"cursor-not-allowed text-gray-500   pointer-events-none"}`}>
                {(downloadLink&&downloadLink?.length>0) ? 'Download CSV' : 'No data to download'}
              </a>
            }
          </div>
      </div>
    )
}

export default App
