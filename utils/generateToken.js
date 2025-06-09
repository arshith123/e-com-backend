import jwt from 'jsonwebtoken'

export const genrateToken  = (userId) => {
    return jwt.sign({id:userId},process.env.JWT_SECRET,{
        expiresIn: '1d',
    })
}