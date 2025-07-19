import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import './ShuffleImageGrid.css';

const images = [
  "https://images.unsplash.com/photo-1515940175183-6798529cb860?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGdhZGdldHN8ZW58MHx8MHx8fDA%3D",
  "https://plus.unsplash.com/premium_photo-1661645433820-24c8604e4db5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8amV3bGVyeSUyMHdpdGglMjB3aGl0ZSUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D",
  "https://images.unsplash.com/photo-1563718512057-a7c5454becbe?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHN0YXRpb25hcnklMjBpdGVtcyUyMHdpdGglMjB3aGl0ZSUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D",
  "https://images.unsplash.com/photo-1675502690904-625c89c9ed46?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDh8fHN0YXRpb25hcnklMjBpdGVtcyUyMHdpdGglMjB3aGl0ZSUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D",
  "https://images.unsplash.com/photo-1610412856749-ccc524f366fa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHBlcnNvbmxhJTIwYmVsb25naW5ncyUyMHdpdGglMjB3aGl0ZSUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D",
  "https://plus.unsplash.com/premium_photo-1669652639356-f5cb1a086976?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Ym9va3MlMjB3aXRoJTIwd2hpdGUlMjBiYWNrZ3JvdW5kfGVufDB8fDB8fHww",
  "https://images.unsplash.com/photo-1524404794194-16bae22718c0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dGV4dGlsZSUyMHdpdGglMjB3aGl0ZSUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D",
  "https://images.unsplash.com/photo-1697294873171-e428499057cb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTF8fEZ1cm5pdHVyZSUyMCUyMGl0ZW1zJTIwd2l0aCUyMHdoaXRlJTIwYmFja2dyb3VuZHxlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1564545677918-633bccb5e58e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cGVyc29uYWwlMjAlMjBiZWxvbmdpbmdzJTIwJTIwaXRlbXMlMjB3aXRoJTIwd2hpdGUlMjBiYWNrZ3JvdW5kfGVufDB8fDB8fHww",
  
];


const shuffle = (arr) => {
  let newArr = [...arr];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

const ShuffleImageGrid = () => {
  const timeoutRef = useRef(null);
  const [shuffledImages, setShuffledImages] = useState(shuffle(images));

  useEffect(() => {
    const shuffleInterval = () => {
      setShuffledImages(shuffle(images));
      timeoutRef.current = setTimeout(shuffleInterval, 3000);
    };
    shuffleInterval();
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return (
    <motion.div layout className="shuffle-grid">
      <AnimatePresence>
        {shuffledImages.slice(0, 9).map((src) => (
          <motion.div
            key={src}
            layout
            transition={{ duration: 1.2, type: "spring" }}
            className="shuffle-grid-item"
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default ShuffleImageGrid;
