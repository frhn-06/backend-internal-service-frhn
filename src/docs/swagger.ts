import swaggerAutogen from 'swagger-autogen'

const doc = {
    info: {
        version: "1.0.0",
        title: "HelpDesk - Internal Service App",
        description: "REST API Documentation for HelpDesk Internal Service App"
    },
    servers: [
        {
            url: "http://localhost:5000",
            description: "Local Server"
        },
        {
            url: "https://backend-internal-service-frhn.vercel.app",
            description: "Deploy Vercel"
        }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer"
            }
        },
        schemas: {
            RegisterRequest: {
                name: "",
                email: "",
                password: "",
                confirmPassword: ""
            },
            LoginRequest: {
                identifier: "",
                password: ""
            },
            DepartmentRequest: {
                name: ""
            },
            DepartmentUpdateRequest: {
                name: ""
            },
            CategoryDepartmentRequest: {
                name: "",
                description: "",
                departmentId: 1
            },
            CategoryDepartmentUpdateRequest: {
                name: "",
                description: "",
                departmentId: 1
            },
            AgentRequest: {
                name: "",
                email: "",
                password: "",
                departmentId: 1 
            },
            AgentUpdateRequest: {
                name: "",
                departmentId: 1 
            },
            TicketRequest: {
                title: "",
                description: "",
                priority: "",
                departmentId: 1,
                categoryId: 1,  
            },
            MessageRequest: {
                content: ""
            },
            UserUpdateProfileRequest: {
                name: ""
            },
            UserUpdatePasswordRequest: {
                oldPassword: "",
                newPassword: "",
                confirmPassword: ""
            }
        }
    }
}


const outputFile = "./swagger-output.json"

const routes = [
    "../app.ts"
];


swaggerAutogen({openapi: "3.0.0"})(outputFile, routes, doc);
console.log("berhasil mendokumentasikan api")