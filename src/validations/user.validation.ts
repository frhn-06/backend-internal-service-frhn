import zod, {z} from 'zod'



const passwordValidate = z.string().min(6, "Password minimal 6 huruf").regex(/[A-Z]/, "Password harus mengandung huruf kapital mininal 1").regex(/\d/, "Password haurs mengandung angka minimal 1")

const RegisterDTO = zod.object({
    name: z.string().trim().min(2, "Nama tidak memenuhi stndar minimal").max(100, "Nama tidak memenuhi standar maksimal"),
    email: z.email("Format email tidak valid").trim(),
    departmentId: z.number().nullable().optional(),
    password: passwordValidate,
    confirmPassword: z.string()
}).refine((value) => value.password === value.confirmPassword, {
    message: "Konfirmasi password tidak sesuai",
    path: ["confirmPassword"]
});



const LoginDTO = zod.object({
    identifier: z.string().trim(),
    password: z.string()
})


const AgentDTO = zod.object({
    name: z.string().trim().min(2, "Nama tidak memenuhi stndar minimal").max(100, "Nama tidak memenuhi standar maksimal"),
    email: z.email("Format email tidak valid").trim(),
    departmentId: z.number().min(0),
    password: passwordValidate,
});


const UserDTO = zod.object({
    name: z.string().trim().min(2, "Nama tidak memenuhi standar minimal").max(100, "Nama tidak memenuhi standar maksimal")
})


const PasswordDTO = zod.object({
    oldPassword: passwordValidate,
    newPassword: passwordValidate,
    confirmPassword: z.string()
}).refine((value) => {
    return value.newPassword === value.confirmPassword
}, {
    message: "Konfirmasi password tidak sesuai",
    path: ["confirmPassword"]
})


export {RegisterDTO, LoginDTO, AgentDTO, UserDTO, PasswordDTO}