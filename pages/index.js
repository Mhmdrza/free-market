import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react';
import run from '../logic';
import styles from '../styles/Home.module.css'

const cashe = Object.create(null);
const { transactionLogs, transactionNumber, nodes } = run();

function nodeIdGenerator (id) {
  return `n-${id}`;
}
function nodeTextIdGenerator (id) {
  return `t-${id}`;
}



function showTransaction ( c, giverId, giverCash, reciverId, reciverCash ) {
  const el1= cashe[giverId] || (cashe[giverId] = document.querySelector('#' + nodeIdGenerator(giverId)));
  const el2= cashe[reciverId] || (cashe[reciverId] = document.querySelector('#' + nodeIdGenerator(reciverId)));
  const el1t= cashe[giverId+'t'] || (cashe[giverId+'t'] = document.querySelector('#' + nodeTextIdGenerator(giverId)));
  const el2t= cashe[reciverId+'t'] || (cashe[reciverId+'t'] = document.querySelector('#' + nodeTextIdGenerator(reciverId)));
  // console.log({element1: giverId, el1: nodeIdGenerator(giverId), el2});
  try {
    el1.style.background = 'red';
    el1.textContent = giverCash;
    el1.style.height = giverCash *3 + 'px';
    // el1.textContent = '-';
    el2.style.background = 'green';
    el2.textContent = reciverCash;
    // el2t.style.color = 'green';
    el2.style.height = reciverCash*3 + 'px';
    transactionPanel.textContent += `\n ${giverId} -> ${reciverId}`
    console.log(c);
    transactionNumber.textContent = c;
    if (giverCash < 1) {
      el1t.style.color = 'gray';
    }
    if (reciverCash < 1) {
      el2t.style.color = 'gray';
    }
    // el2.textContent = '+';
    
  } catch (error) {
    
  }
}

let c = 0;
let rafId;
function rafRunner () {
  if ( c < transactionNumber )  {
    // console.log(...transactionLogs[c]);
    showTransaction(c, ...transactionLogs[c])
    rafId = requestAnimationFrame(rafRunner);
    c ++;
  } else {
    cancelAnimationFrame(rafId)
  }
}

export default function Home() {
  const [people, setPeople] = useState(10);
  const [startingMoney, setStartingMoney] = useState(5);
  
  useEffect(() => {
    rafRunner()
  }, []);


  return (
    <div className={styles.container}>
      <Head>
        <title>Free market</title>
        <meta name="description" content="Simulation of free market" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Simulation of free market 
        </h1>
          <h2>rules:</h2>
          <ul className={styles.description}>
            <li>Everyone starts with 5$ cash</li>
            <li>Anyone can trade with others (chosen randomly)</li>
            <li>50 / 50 chance of winning in trade</li>
            <li>winner gets +1 and other lose -1</li>
            <li>If someone reaches 0$ they cant trade anymore</li>
          </ul>
        <div style={{display: 'flex', justifyContent: 'space-around', width: '100%'}}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            height: '200px',
          }}>
          { nodes.map( ({id, cash}) => (
            <div key={id} style={{
              width: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-end',
              // border: '1px solid yellow'
            }}>
              <span id={nodeIdGenerator(id)} style={{
                width: '10px',
                border: '1px solid yellow',
                fontSize: '.5rem',
                textAlign: 'center'
              }}></span>
              <span style={{ marginTop: '10px'}} id={nodeTextIdGenerator(id)}>{id}</span>
            </div>
          ))}
          </div>
          <div style={{
            // overflowAnchor: 'auto',
            display: 'flex',
            flexDirection: 'column-reverse',
            overflowY: 'scroll',
            height: '200px',
            padding: '0 1rem'
          }}>
            <pre id='transactionPanel'></pre>
            <p id='s'>sss</p>
            <p id='transactionNumber'></p>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}
