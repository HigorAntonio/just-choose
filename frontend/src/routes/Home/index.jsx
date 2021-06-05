import React, { useEffect } from 'react';

import { Container } from './styles';

const Home = ({ wrapperRef }) => {
  useEffect(() => {
    // Posiciona o scroll no início da página
    wrapperRef.current.scrollTop = 0;
    wrapperRef.current.scrollLeft = 0;
  }, [wrapperRef]);

  return (
    <Container>
      <h1>Home</h1>
      <p>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus
        culpa quidem libero necessitatibus dolorem aperiam neque quisquam cum
        non accusamus quibusdam, pariatur vel officiis repellendus distinctio
        deserunt eos ipsam a velit blanditiis est soluta minima! Esse aliquid
        facilis eum mollitia voluptas, sed obcaecati aut laudantium sunt neque?
        Minima, rerum expedita.
      </p>
      <p>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus
        culpa quidem libero necessitatibus dolorem aperiam neque quisquam cum
        non accusamus quibusdam, pariatur vel officiis repellendus distinctio
        deserunt eos ipsam a velit blanditiis est soluta minima! Esse aliquid
        facilis eum mollitia voluptas, sed obcaecati aut laudantium sunt neque?
        Minima, rerum expedita.
      </p>
      <p>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus
        culpa quidem libero necessitatibus dolorem aperiam neque quisquam cum
        non accusamus quibusdam, pariatur vel officiis repellendus distinctio
        deserunt eos ipsam a velit blanditiis est soluta minima! Esse aliquid
        facilis eum mollitia voluptas, sed obcaecati aut laudantium sunt neque?
        Minima, rerum expedita.
      </p>
      <p>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus
        culpa quidem libero necessitatibus dolorem aperiam neque quisquam cum
        non accusamus quibusdam, pariatur vel officiis repellendus distinctio
        deserunt eos ipsam a velit blanditiis est soluta minima! Esse aliquid
        facilis eum mollitia voluptas, sed obcaecati aut laudantium sunt neque?
        Minima, rerum expedita.
      </p>
      <p>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus
        culpa quidem libero necessitatibus dolorem aperiam neque quisquam cum
        non accusamus quibusdam, pariatur vel officiis repellendus distinctio
        deserunt eos ipsam a velit blanditiis est soluta minima! Esse aliquid
        facilis eum mollitia voluptas, sed obcaecati aut laudantium sunt neque?
        Minima, rerum expedita.
      </p>
      <p>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus
        culpa quidem libero necessitatibus dolorem aperiam neque quisquam cum
        non accusamus quibusdam, pariatur vel officiis repellendus distinctio
        deserunt eos ipsam a velit blanditiis est soluta minima! Esse aliquid
        facilis eum mollitia voluptas, sed obcaecati aut laudantium sunt neque?
        Minima, rerum expedita.
      </p>
      <p>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus
        culpa quidem libero necessitatibus dolorem aperiam neque quisquam cum
        non accusamus quibusdam, pariatur vel officiis repellendus distinctio
        deserunt eos ipsam a velit blanditiis est soluta minima! Esse aliquid
        facilis eum mollitia voluptas, sed obcaecati aut laudantium sunt neque?
        Minima, rerum expedita.
      </p>
      <p>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus
        culpa quidem libero necessitatibus dolorem aperiam neque quisquam cum
        non accusamus quibusdam, pariatur vel officiis repellendus distinctio
        deserunt eos ipsam a velit blanditiis est soluta minima! Esse aliquid
        facilis eum mollitia voluptas, sed obcaecati aut laudantium sunt neque?
        Minima, rerum expedita.
      </p>
      <p>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus
        culpa quidem libero necessitatibus dolorem aperiam neque quisquam cum
        non accusamus quibusdam, pariatur vel officiis repellendus distinctio
        deserunt eos ipsam a velit blanditiis est soluta minima! Esse aliquid
        facilis eum mollitia voluptas, sed obcaecati aut laudantium sunt neque?
        Minima, rerum expedita.
      </p>
      <p>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus
        culpa quidem libero necessitatibus dolorem aperiam neque quisquam cum
        non accusamus quibusdam, pariatur vel officiis repellendus distinctio
        deserunt eos ipsam a velit blanditiis est soluta minima! Esse aliquid
        facilis eum mollitia voluptas, sed obcaecati aut laudantium sunt neque?
        Minima, rerum expedita.
      </p>
    </Container>
  );
};

export default Home;
