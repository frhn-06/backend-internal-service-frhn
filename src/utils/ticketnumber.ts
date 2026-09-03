import crypto from 'crypto'

const generateTicketNumber = () => {
    const year = new Date().getFullYear();
    
    const number = crypto.randomInt(100000, 999999);

    return `TCK-${year}-${number}`;
}

export default generateTicketNumber;