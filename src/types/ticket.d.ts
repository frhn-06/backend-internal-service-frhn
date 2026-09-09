interface ITicket {
    title: string;
    description: string;
    messages: {
        content: string;
        sender: {
            name: string;
            role: string;
        };
        createdAt: Date;
    }[];
}

export type {ITicket}