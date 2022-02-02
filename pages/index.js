import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react';
import run from '../logic';


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
    transactionNumber.textContent = c;
    transactionPanel.append(`${names[giverId]}  →  ${names[reciverId]} `)
  } catch (error) {
    console.log(error);
  }
}

let rafId;
function startSimulation() {
  const { transactionLogs, transactionNumber, luckiest, outOfBussiness } = run();
  let c = 0;
  cancelAnimationFrame(rafId);
  function rafRunner () {
    if ( c < transactionNumber )  {
      showTransaction(c, ...transactionLogs[c])
      c ++;
      return rafId = requestAnimationFrame(rafRunner);
    } else {
      cancelAnimationFrame(rafId)
    }
  }
  return rafRunner();
}

export default function Home() {
  const [started, setStarted] = useState(0);
  const [people, setPeople] = useState(10);
  const [startingMoney, setStartingMoney] = useState(5);
  const nodes = Array(people).fill().map((_, index) => ({ cash: startingMoney, id: index }));

  useEffect(() => {
    nodes.forEach(node => {
      const el1= (cashe[node.id] = document.querySelector('#' + nodeIdGenerator(node.id)));
      drawBar(el1, node.cash, true);
    })
  }, []);

  useEffect(() => {
    try {
      document.querySelector('#transactionPanel').textContent ='';
    } catch (error) {
      
    }
  }, [started]);
  
  
  return (
    <div className='p-4'>
      <Head>
        <title>Free market Simulation</title>
        <meta name="description" content="Simulation of free market" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className='container p-0'>
        <h1 className='h1 my-4'>
          Simulation of free market 
        </h1>
        <h2>rules:</h2>
        <ul className=''>
          <li>Everyone starts with <code>5$</code> cash</li>
          <li>Anyone can trade with others <small>(chosen randomly)</small></li>
          <li>50 / 50 chance of winning in trade</li>
          <li>Luckier person gets <code>+1</code> and other lose <code>-1</code></li>
          <li>If someone reaches <code>0$</code> they cant trade anymore</li>
          <li>No more trading = collapse of economy</li>
        </ul>
        {<div className='d-flex justify-content-center0 mt-5'>
          <button className=' btn btn-primary' onClick={()=>(startSimulation(), setStarted(started+1))} >
            {started? "Restart": 'Start'} simulation
          </button>
        </div>}
        <div className='ps-2'>
          <div className='row flex-row-reverse justify-content-end'>
          <div className='mb-5 col-md-9 col-lg-6 p-0' style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-around',
            height: '250px',
            pointerEvents: 'none'
          }}>
          { nodes.map( ({id, cash}) => (
            <div key={id} className='d-flex justify-content-center align-items-center flex-column col-1'>
              <span id={nodeIdGenerator(id)} className='d-flex justify-content-center align-items-baseline' style={{
                width: '50%',
                border: '1px solid white',
                borderTopRightRadius: 2,
                borderTopLeftRadius: 2,
                transition: 'background .15s',
                fontSize: '95%',
                textAlign: 'center',
              }}/>
              <span id={nodeTextIdGenerator(id)} style={{
                transform: 'rotate(90deg) translateX(2rem)',
              }}>{names[id]}</span>
            </div>
          ))}
          </div>
          {!!started && <>
            <div className='p-0 col-md-3 col-lg-2 d-flex flex-column-reverse flex-md-column justify-content-around'>
              <div className='ms-md-2 mt-3 col-xs-6 col-md-12' id='transactionPanel' style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column-reverse',
                overflowY: 'scroll',
                height: '200px',
                hyphens: 'manual'
              }}>
              </div>
              <div >Number of trades: <span id='transactionNumber' className='ms-md-4 py-sm-2 py-0'></span></div>
            </div>
          </>}
          </div>
        </div>
        <br/>
        <h4>Summary:</h4>
        <p className='col-md-8 mt-2'>
          Even in the absoultely fair and free market like this, all the money will eventually endup in one person hand.
          Which means the collapse of the economy.
        </p>
      </main>

      <footer className='container mt-3'>
        <a href='https://github.com/Mhmdrza/free-market'>
          View the project on Github
        </a>
        <br/>
        &nbsp;
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className='mt-3'>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}
