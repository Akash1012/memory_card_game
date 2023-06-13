import { useState, useEffect, useRef } from "react";
import { defaultImage } from "./assets/images";
import ReactDOM from "react-dom";
import DATA from "./data";

let saveOpenImageName = [];
const Backdrop = () => {
  return <div className="backdrop" />;
};
function App(props) {
  const [timer, setTimer] = useState(35);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [startStop, setStartStop] = useState(false);
  const [storeData, setStoreData] = useState([]);
  const modalContainer = useRef();

  useEffect(() => {
    let interval;
    if (startStop) {
      // interval = setInterval(() => {
      //   setTimer((prevTimer) => prevTimer - 1);
      // }, 1000);

      if (timer === 0) {
        setStartStop(!startStop);
        setGameOver(!gameOver);
        // clearInterval(interval);
      }
    }

    return () => {
      clearInterval(interval);
    };
  }, [timer, startStop, gameOver]);

  const gameStart = () => {
    modalContainer.current.style.display = "none";
    setStartStop(!startStop);
    setStoreData(DATA);
  };

  const forImageCheck = (image) => {
    saveOpenImageName.push(image.name);
    if (saveOpenImageName.length === 2) {
      clearTimeout(timer);
      let allEqual = saveOpenImageName.every(
        (val) => val === saveOpenImageName[0]
      );

      if (!allEqual) {
        const updateData = storeData.map((item) => {
          if (saveOpenImageName.includes(item.name)) {
            return {
              ...item,
              open: false,
            };
          }
          return item;
        });
        if (score > 0) {
          setScore((score) => score - 10);
        }
        let timer;
        timer = setTimeout(() => {
          setStoreData(updateData);
        }, 500);
      } else {
        setScore((score) => score + 10);
      }

      saveOpenImageName = [];
    }
  };

  const handleImage = (checkImage) => {
    const updateData = storeData.map((item) => {
      if (item.id === checkImage.id) {
        return {
          ...item,
          open: true,
        };
      }
      return item;
    });
    if (updateData) {
      setStoreData(updateData);
      forImageCheck(checkImage);
    }
  };

  const resetGame = () => {
    setStoreData([]);
    setTimer(35);
    setGameOver(false);
    modalContainer.current.style.display = "flex";
  };

  const ModalOverlay = () => {
    return (
      <div className="modal_">
        <div className="header">
          <h2>SCORE</h2>
        </div>
        <div className="content">
          <p
            style={{
              fontWeight: "bold",
              fontSize: "35px",
            }}
          >
            YOUR SCORE: {score}
          </p>
        </div>
        <footer className="actions">
          <button onClick={resetGame}>OKAY / RESET</button>
        </footer>
      </div>
    );
  };

  return (
    <div>
      {gameOver && (
        <>
          {ReactDOM.createPortal(
            <Backdrop onConfirm={props.onConfirm} />,
            document.getElementById("backdrop-root")
          )}
          {ReactDOM.createPortal(
            <ModalOverlay />,
            document.getElementById("overlay-root")
          )}
        </>
      )}
      <nav className="nav_bar">
        {/* <div>Timer - {timer}</div> */}
        <div>Magic Cards</div>
      </nav>
      <div className="modalContainer" ref={modalContainer}>
        <div className="modal">
          <button className="btn_game" onClick={gameStart}>
            GAME START
          </button>
        </div>
      </div>
      <div className="main_card">
        {storeData.map((item, index) => {
          return (
            <div
              className="card_child"
              key={index}
              onClick={() => (item.open ? "() =>{}" : handleImage(item))}
            >
              <p className="name">{item.name}</p>
              {item.open ? (
                <div className="pic_parent">
                  <img className="pic" src={item.pic} alt={"pic"} />
                </div>
              ) : (
                <div className="pic_parent">
                  <img className="pic" src={defaultImage} alt={"pic"} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
