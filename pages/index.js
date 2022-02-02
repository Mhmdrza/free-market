import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react';
import run from '../logic';
import styles from '../styles/Home.module.css'

const names = [
  'Liam', 
  'Olivia',
  'Henry',
  'Emma',
  'Oliver',
  'Ava',
  'Noah',
  'Sophia',
  'Elijah',
  'Mia',
]

const cashe = Object.create(null);

function nodeIdGenerator (id) {
  return `n-${id}`;
}
function nodeTextIdGenerator (id) {
  return `t-${id}`;
}

function drawBar (el, value, isPositive) {
  el.style.background = isPositive? 'green' : 'red';
  el.textContent = value;
  el.style.height = value *3.5 + 'px';
}

function showTransaction ( c, giverId, giverCash, reciverId, reciverCash ) {
  const el1= cashe[giverId] || (cashe[giverId] = document.querySelector('#' + nodeIdGenerator(giverId)));
  const el2= cashe[reciverId] || (cashe[reciverId] = document.querySelector('#' + nodeIdGenerator(reciverId)));
  const el1t= cashe[giverId+'t'] || (cashe[giverId+'t'] = document.querySelector('#' + nodeTextIdGenerator(giverId)));
  const transactionPanel = cashe['transactionPanel'] || (cashe['transactionPanel'] = document.querySelector('#transactionPanel'));
  const transactionNumber = cashe['transactionNumber'] || (cashe['transactionNumber'] = document.querySelector('#transactionNumber'));
  try {
    drawBar(el1, giverCash, false);
    if (giverCash < 1) {
      el1t.style.color = 'gray';
    }
    drawBar(el2, reciverCash, true);
    transactionPanel.innerHTML += `\n<span>${names[giverId]}</span> -> <span>${names[reciverId]}</span>`
    transactionNumber.textContent = c;
  } catch (error) {
    console.log(error);
  }
}

function startSimulation() {
  const { transactionLogs, transactionNumber, luckiest, outOfBussiness } = run();
  let c = 0;
  let rafId;
  function rafRunner () {
    if ( c < transactionNumber )  {
      showTransaction(c, ...transactionLogs[c])
      c ++;
      return rafId = requestAnimationFrame(rafRunner);
    } else {
      cancelAnimationFrame(rafId)
    }
  }
  rafRunner();
}

export default function Home() {
  const [started, setStarted] = useState(false);
  const [people, setPeople] = useState(10);
  const [startingMoney, setStartingMoney] = useState(5);
  const nodes = Array(people).fill().map((_, index) => ({ cash: startingMoney, id: index }));

  useEffect(() => {
    nodes.forEach(node => {
      const el1= (cashe[node.id] = document.querySelector('#' + nodeIdGenerator(node.id)));
      drawBar(el1, node.cash, true);
    })
  }, []);
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Free market Simulation</title>
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
          {!started && <div style={{textAlign: 'center', padding: '1rem 0'}}>
            <button onClick={()=>(startSimulation(), setStarted(true))} style={{padding: '.5rem 1rem'}}>
              Start simulation
            </button>
          </div>}
        <div style={{display: 'flex', justifyContent: 'space-around', width: '100%', flexWrap: 'wrap2'}}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            width: '100%',
            justifyContent: 'space-around',
            height: '200px',
          }}>
          { nodes.map( ({id, cash}) => (
            <div key={id} style={{
              width: '30px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              // border: '1px solid yellow'
            }}>
              <span id={nodeIdGenerator(id)} style={{
                width: '10px',
                border: '1px solid yellow',
                fontSize: '.5rem',
                textAlign: 'center'
              }}/>
              <span style={{ marginTop: '10px', fontSize: '.5rem'}} id={nodeTextIdGenerator(id)}>{names[id]}</span>
            </div>
          ))}
          </div>
        </div>
      </main>

      {started && <>
        <h3>
          Stats:
        </h3>
        <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between'}}>
          <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>Number of transcations: <span id='transactionNumber' className={styles.transactionNumber}></span></div>
          <div style={{
            display: 'flex',
            position: 'relative',
            alignItems: 'center',
            flexDirection: 'column-reverse',
            overflowY: 'scroll',
            height: '200px',
            padding: '0 1rem',
            width: '50vw',
          }}>
            <pre id='transactionPanel'></pre>
          </div>
          {/* <p>Lucky Person: <strong>{names[luckiest.id]}</strong></p> */}
          {/* <p style={{display: 'flex', flexWrap: 'wrap', alignItems: 'baseline'}}>Out of Bussiness: {Object.values(outOfBussiness).map(p => <small key={p.id}>{names[p.id]},&nbsp;</small>)}</p> */}
        </div>
      </>}
      <br/>
      <h4>Summary:</h4>
      <p>
        Even in the absoultely fair and free market like this, all the money will eventually endup in one person hand.
        It means the collapse of the economy. at this point people will flip the table and re-distrubte the wealth by force.
        However there is a solution to prevent it. The Rich should voluntarly giveaway some money to poor to thrive the economy.
      </p>
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
