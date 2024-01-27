import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { AiOutlinePoweroff, AiOutlineMenu } from "react-icons/ai";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  const [ip, setIp] = useState(null)
  const [isWork, setWork] = useState(false)
  const [isSetup, setSetup] = useState(false);

   useEffect(() => {
    const uci = async () => {
      function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
      while (true) {
        let ip = await invoke("ip")
        ip = JSON.parse(ip.toLowerCase())
        console.log(ip)
        setIp(ip);
        await sleep(5000)
      }
    }
    uci()
  }, [])

  const moduleIp = () => {
    return (
      <div className="flex gap-2 items-center">
        <p>{ip.country}</p>
        <p>{ip.query}</p>
      </div>
    )
  }

  const runWork = () => {

  }

  const stopWork = () => {

  }

  const setupProfile = () => {
    setSetup(!isSetup)
  }

  return (
    <>
      <div className="flex flex-col justify-between items-center h-screen w-screen dark:bg-[#222523] dark:text-white">
        <div className="absolute top-0 h-8 w-full" data-tauri-drag-region></div>
        <span></span>
        {isSetup ? (
          <div className="flex flex-col gap-5 items-center">
            <fieldset className="space-y-3 w-56 rounded-lg p-3">
                <legend className="pl-1">sshuttle settings</legend>
                <input type="text" placeholder="user" />
                <input type="text" placeholder="ip" />
            </fieldset>
            <div className="flex gap-2">
              <button className="btn-simple">
                Save
              </button>
              <button className="btn-simple" 
              onClick={() => setSetup(false)}>
                Exit
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-5 items-center">
            <button className="btn-simple"
            onClick={() => setSetup(true)}>
              <p>Setup profile</p>
            </button>
            <img src="/avpn.png" alt="avpn logo" className={isWork ? "w-44" : "w-44 opacity-40"} />
            <p className="text-xl">not connected</p>
            <button className={`p-2 w-20 h-20 rounded-full ${isWork ? "bg-blue-500" : "bg-gray-500"}`}
            onClick={() => setWork(!isWork)}>
              <AiOutlinePoweroff className="w-full h-full" color="white" />
            </button>
          </div>
        )}
        <div className="p-1 px-3 w-screen text-white bg-blue-500 flex justify-between items-center">
          {ip && moduleIp()}
          <div className="flex items-center gap-2">
            <a target="_blank" href="">github</a>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
