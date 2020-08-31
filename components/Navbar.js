import styles from '../styles/Navbar.module.css';

function Navbar({ count, product }) {
  return (
    <section>
      <nav className={styles.container}>
        {count === 0 ? <li>Cart: {count}</li> : <li>Cart: {count}</li>}
      </nav>
    </section>
  );
}

export default Navbar;
