import wpi from 'wiring-pi';

const fd = wpi.wiringPiI2CSetup(0x23);
const data = wpi.wiringPiI2CRead(fd);

console.log(data);