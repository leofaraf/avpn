import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { AiOutlinePoweroff, AiOutlineMenu } from "react-icons/ai";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  const [currentIp, setCurrentIp] = useState("")
  const [isWork, setWork] = useState(false)

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name }));
  }

  async function updateCurrentIp() {
    setCurrentIp(await invoke("current_ip"));
  }

  useEffect(() => {
    const uci = async () => {
      function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
      while (true) {
        await updateCurrentIp()
        await sleep(5000)
      }
    }
    uci()
  }, [])

  const moduleIp = (ip) => {
    const state = JSON.parse(ip.toLowerCase())
    console.log(state)

    return (
      <div className="flex gap-2 items-center">
        <p>{state.country}</p>
        <p>{state.query}</p>
      </div>
    )
  }

  const runWork = () => {

  }

  const stopWork = () => {

  }

  return (
    <div className="flex flex-col justify-between items-center h-screen w-screen dark:bg-zinc-800 dark:text-white">
      <div className="w-full flex p-5 justify-between">
        <button>
          <AiOutlineMenu className="w-5 h-5" />
        </button>
      </div>
      <div className="flex flex-col gap-4 items-center">
        <p className="text-xl">Not connected</p>
        {isWork ? (
          <button className="p-2 w-22 h-22 bg-gray-500 rounded-full"
          onClick={() => setWork(false)}>
            <AiOutlinePoweroff className="w-full h-full" color="white" />
          </button>
        ) : (
          <button className="p-2 w-20 h-20 bg-blue-500 rounded-full"
          onClick={() => setWork(true)}>
            <AiOutlinePoweroff className="w-full h-full" color="white" />
          </button>
        )}
      </div>
      <div className="p-1 px-3 w-screen text-white bg-blue-500 flex justify-between items-center">
        {currentIp && moduleIp(currentIp)}
        <div className="flex items-center gap-2">
          <a target="_blank" href="">github</a>
        </div>
      </div>
    </div>
  );
}

export default App;
