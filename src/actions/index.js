const words = ['Hommie', 'Dude', 'Super Dev', 'Dev', 'Reduxer', 'YOLO', 'BYE', 'Crazy', 'Superman', 'Github', 'React', 'Redux', 'Facebook', 'Duck', 'SHIELD', 'Captain', 'World', 'Mars', 'Webpack', 'You', 'Hello', 'Japanese people', 'Gaeron!'];

export const displayRandomMessage = () => {
  const message = words[Math.floor(Math.random() * words.length)];
  return { type: 'SEND_MESSAGE', message };
};