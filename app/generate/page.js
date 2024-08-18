'use client'

import { useUser } from "@clerk/nextjs"
import { Box, Button, Card, CardActionArea, CardContent, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Paper, TextField, Typography, CircularProgress } from "@mui/material"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { db } from "@/firebase"
import { doc, collection, setDoc, getDoc, writeBatch } from "firebase/firestore"

export default function Generate(){
    const {isLoaded, isSignedIn, user} = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState([])
    const [text, setText] = useState("")
    const [name, setName] = useState("")
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    // Load saved flashcards from localStorage on component mount
    useEffect(() => {
        const savedFlashcards = localStorage.getItem('flashcards')
        if (savedFlashcards) {
            setFlashcards(JSON.parse(savedFlashcards))
        }
    }, [])

    // Save flashcards to localStorage whenever they change
    useEffect(() => {
        if (flashcards.length > 0) {
            localStorage.setItem('flashcards', JSON.stringify(flashcards))
        }
    }, [flashcards])

    const handleSubmit = async () => {
        setLoading(true)
        fetch('api/generate', {
            method: 'POST',
            body: text,
        })
        .then((res) => res.json())
        .then((data) => setFlashcards(data))
        .catch((error) => {
            console.error("Error generating flashcards:", error)
        })
        .finally(() => {
            setLoading(false)
        })
    }

    const handleCardClick = (id) => {
        setFlipped((prev) =>  ({
            ...prev,
            [id]: !prev[id]
        }))
    }

    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const saveFlashcards = async () => {
        if (!name){
            alert('Please enter a name')
            return
        }

        const batch = writeBatch(db)
        const userDocRef = doc(collection(db, 'users'), user.id)
        const docSnap = await getDoc(userDocRef)

        if (docSnap.exists()){
            const collections = docSnap.data().flashcards || []
            if (collections.find((f) => f.name === name)){
                alert("Flashcard collection with the same name already exists.")
                return
            } else {
                collections.push({name})
                batch.set(userDocRef, {flashcards: collections}, {merge: true})
            }
        } else{
            batch.set(userDocRef, {flashcards: [{name}]})
        }

        const colRef = collection(userDocRef, name)
        flashcards.forEach((flashcard) => {
            const cardDocRef = doc(colRef)
            batch.set(cardDocRef, flashcard)
        })

        await batch.commit()
        handleClose()
        router.push('/flashcards')
    }

    return (
        <Box sx={{
                        minHeight: '100vh',
                        backgroundColor: 'beige',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        py: 4,
                    }}>
            <Container maxWidth="md" sx={{ backgroundColor: "beige", minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative" }}>
                {/* View Saved Flashcards Button */}
                <Box sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    backgroundColor: '#fef68a',
                    boxShadow: '3px 3px 5px rgba(0, 0, 0, 0.3)',
                    padding: 1,
                    transform: 'rotate(-2deg)',
                    borderRadius: '5px',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                        transform: 'rotate(0deg)',
                    }
                }}>
                    <Button variant="contained" color="primary" onClick={() => router.push('/flashcards')}>
                        View Saved Flashcards
                    </Button>
                </Box>

                <Box sx={{ mt: 4, mb: 6, display: "flex", flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="h4">
                        Je Suis Ton Study Buddy
                    </Typography>  
                    <Typography variant="h5">
                        Tell me what you want to learn and I will generate the flashcards
                    </Typography>
                    <Paper sx={{ p: 4, width: "100%" }}>
                        <TextField 
                            value={text} 
                            onChange={(e) => setText(e.target.value)} 
                            label="Enter Text" 
                            fullWidth
                            multiline
                            rows={4}
                            variant="outlined"
                            sx={{ mb: 2 }}/>
                        <Button
                            variant="contained" color="primary" onClick={handleSubmit} fullWidth
                            disabled={loading}
                        > 
                            Submit
                        </Button>
                    </Paper>
                </Box>

                {loading && (
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                        <CircularProgress />
                    </Box>
                )}

                {!loading && flashcards.length > 0 && (
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h5">
                            Flashcards Preview
                        </Typography>
                        <Grid container spacing={3}>
                            {flashcards.map((flashcard, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <Card>
                                        <CardActionArea onClick={() => {
                                            handleCardClick(index)
                                        }}>
                                            <CardContent>
                                                <Box sx={{
                                                    perspective: "1000px",
                                                    '& > div': {
                                                        transition: 'transform 0.6s',
                                                        transformStyle: 'preserve-3d',
                                                        position: 'relative',
                                                        width: '100%',
                                                        height: '200px',
                                                        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
                                                        transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)'
                                                    },
                                                    '& > div > div': {
                                                        position: 'absolute',
                                                        width: '100%',
                                                        height: '100%',
                                                        backfaceVisibility: "hidden",
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        padding: 2,
                                                        boxSizing: 'border-box'
                                                    },
                                                    '& > div > div:nth-of-type(2)': {
                                                        transform: 'rotateY(180deg)'
                                                    }
                                                }}>
                                                    <div>
                                                        <div>
                                                            <Typography variant="h5" component="div">
                                                                {flashcard.front}
                                                            </Typography>
                                                        </div>
                                                        <div>
                                                            <Typography variant="h5" component="div">
                                                                {flashcard.back}
                                                            </Typography>
                                                        </div>
                                                    </div>
                                                </Box>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                        <Box sx={{ mt: 4, display: "flex", justifyContent: 'center' }}>
                            <Button variant="contained" color="secondary" onClick={handleOpen}>
                                Save
                            </Button>
                        </Box>
                    </Box>
                )}

                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Save Flashcards</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please enter a name for your flashcards collection
                        </DialogContentText>
                        <TextField 
                            autoFocus
                            margin="dense"
                            label="Collection Name"
                            type="text"
                            fullWidth
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            variant="outlined"/>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button onClick={saveFlashcards}>
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    )
}

// 'use client'

// import { useUser } from "@clerk/nextjs"
// import { Box, Button, Card, CardActionArea, CardContent, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Paper, TextField, Typography, CircularProgress } from "@mui/material"
// import { useRouter } from "next/navigation"
// import { useState, useEffect } from "react"
// import { db } from "@/firebase"
// import { doc, collection, setDoc, getDoc, writeBatch } from "firebase/firestore"

// export default function Generate(){
//     const {isLoaded, isSignedIn, user} = useUser()
//     const [flashcards, setFlashcards] = useState([])
//     const [flipped, setFlipped] = useState([])
//     const [text, setText] = useState("")
//     const [name, setName] = useState("")
//     const [open, setOpen] = useState(false)
//     const [loading, setLoading] = useState(false)
//     const router = useRouter()

//     // Load flashcards from local storage on initial render
//     useEffect(() => {
//         const savedFlashcards = localStorage.getItem('flashcards')
//         if (savedFlashcards) {
//             setFlashcards(JSON.parse(savedFlashcards))
//         }
//     }, [])

//     // Save flashcards to local storage whenever they change
//     useEffect(() => {
//         if (flashcards.length > 0) {
//             localStorage.setItem('flashcards', JSON.stringify(flashcards))
//         }
//     }, [flashcards])

//     const handleSubmit = async () => {
//         setLoading(true)
//         fetch('api/generate', {
//             method: 'POST',
//             body: text,
//         })
//         .then((res) => res.json())
//         .then((data) => setFlashcards(data))
//         .catch((error) => {
//             console.error("Error generating flashcards:", error)
//         })
//         .finally(() => {
//             setLoading(false)
//         })
//     }

//     const handleCardclick = (id) => {
//         setFlipped((prev) =>  ({
//             ...prev,
//             [id]: !prev[id]
//         }))
//     }

//     const handleOpen = () =>{
//         setOpen(true)
//     }
    
//     const handleClose = () => {
//         setOpen(false)
//     }

//     const saveFlashcards = async () => {
//         if (!name){
//             alert('Please enter a name')
//             return
//         }
        
//         const batch = writeBatch(db)
//         const userDocRef = doc(collection(db, 'users'), user.id)
//         const docSnap = await getDoc(userDocRef)

//         if (docSnap.exists()){
//             const collections = docSnap.data().flashcards || []
//             if (collections.find((f) => f.name === name)){
//                 alert("Flashcard collection with the same name already exists.")
//                 return
//             }
//             else{
//                 collections.push({name})
//                 batch.set(userDocRef, {flashcards: collections}, {merge: true})
//             }
//         } else{
//             batch.set(userDocRef, {flashcards: [{name}]})
//         }

//         const colRef = collection(userDocRef, name)
//         flashcards.forEach((flashcard) => {
//             const cardDocRef = doc(colRef)
//             batch.set(cardDocRef, flashcard)
//         })

//         await batch.commit()
//         handleClose()
//         router.push('/flashcards')
//     }

//     return (
//         <Box sx={{
//             minHeight: '100vh',
//             backgroundColor: 'beige',
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             py: 4,
//         }}>
//             <Container maxWidth="md">
//                 <Box sx={{
//                     mt: 4, mb: 6, display: "flex", flexDirection: 'column', alignItems: 'center'
//                 }}>
//                     <Typography variant="h4">
//                         Je Suis Ton Study Buddy
//                     </Typography>  
//                     <Typography variant="h5">
//                         Tell me what you want to learn and I will generate the flashcards
//                     </Typography>  
//                     <Paper sx={{p: 4, width: "100%"}}>
//                         <TextField 
//                             value={text} 
//                             onChange={(e) => setText(e.target.value)} 
//                             label="Enter Text" 
//                             fullWidth
//                             multiline
//                             rows={4}
//                             variant="outlined"
//                             sx={{
//                                 mb: 2
//                             }}/>
//                         <Button
//                             variant="contained" color="primary" onClick={handleSubmit} fullWidth
//                             disabled={loading}
//                         > 
//                             Submit
//                         </Button>
//                     </Paper>
//                 </Box>

//                 {loading && (
//                     <Box sx={{display: "flex", justifyContent: "center", mt: 4}}>
//                         <CircularProgress />
//                     </Box>
//                 )}

//                 {!loading && flashcards.length > 0 && (
//                     <Box sx={{mt: 4}}>
//                         <Typography variant="h5">
//                             Flashcards Preview
//                         </Typography>
//                         <Grid container spacing={3}>
//                             {flashcards.map((flashcard, index) => (
//                                 <Grid item xs={12} sm={6} md={4} key={index}>
//                                     <Card sx={{
//                                         height: { xs: '250px', sm: '300px', md: '350px' },
//                                         display: 'flex',
//                                         flexDirection: 'column',
//                                         justifyContent: 'center',
//                                         alignItems: 'center',
//                                     }}>
//                                         <CardActionArea onClick={() => {
//                                             handleCardclick(index)
//                                         }} sx={{ height: '100%' }}>
//                                             <CardContent sx={{ textAlign: 'center', padding: { xs: 2, sm: 3, md: 4 } }}>
//                                                 <Box sx={{
//                                                     perspective:"1000px",
//                                                     '& > div': {
//                                                     transition: 'transform 0.6s',
//                                                     transformStyle: 'preserve-3d',
//                                                     position: 'relative',
//                                                     width: '100%',
//                                                     height: '100%',
//                                                     transform: flipped[index]? 'rotateY(180deg)': 'rotateY(0deg)'
//                                                 }, 
//                                                     '& > div > div': {
//                                                     position: 'absolute',
//                                                     width: '100%',
//                                                     height: '100%',
//                                                     backfaceVisibility: "hidden",
//                                                     display: "flex",
//                                                     justifyContent: "center",
//                                                     alignItems: "center",
//                                                     padding: 2,
//                                                     boxSizing: 'border-box'
//                                                 },  
//                                                     '& > div > div:nth-of-type(2)':{
//                                                         transform: 'rotateY(180deg)'
//                                                     }

//                                                 }}>
//                                                     <div>
//                                                         <div>
//                                                             <Typography 
//                                                                 variant="h6"
//                                                                 component="div"
//                                                                 sx={{ fontSize: { xs: '1rem', sm: '1.2rem', md: '1.4rem' } }}
//                                                             >
//                                                                 {flashcard.front}
//                                                             </Typography>
//                                                         </div>
//                                                         <div>
//                                                             <Typography 
//                                                                 variant="h6"
//                                                                 component="div"
//                                                                 sx={{ fontSize: { xs: '1rem', sm: '1.2rem', md: '1.4rem' } }}
//                                                             >
//                                                                 {flashcard.back}
//                                                             </Typography>
//                                                         </div>
//                                                     </div>
//                                                 </Box>
//                                             </CardContent>
//                                         </CardActionArea>
//                                     </Card>
//                                 </Grid>
//                             ))}
//                         </Grid>
//                         <Box sx={{mt: 4, display: "flex", justifyContent: 'center'}}>
//                             <Button variant="contained" color="secondary" onClick={handleOpen}>
//                                 Save
//                             </Button>
//                         </Box>
//                     </Box>
//                 )}

//                 <Dialog open={open} onClose={handleClose}>
//                     <DialogTitle>Save Flashcards</DialogTitle>
//                     <DialogContent>
//                         <DialogContentText>
//                             Please enter a name for your flashcards collection
//                         </DialogContentText>
//                         <TextField 
//                             autoFocus
//                             margin="dense"
//                             label = "Collection Name"
//                             type="text"
//                             fullWidth
//                             value={name}
//                             onChange={(e) => setName(e.target.value)}
//                             variant="outlined"/>
//                     </DialogContent>
//                     <DialogActions>
//                         <Button onClick={handleClose}>
//                             Cancel
//                         </Button>
//                         <Button onClick={saveFlashcards}>
//                             Save
//                         </Button>
//                     </DialogActions>
//                 </Dialog>
//             </Container>
//         </Box>
//     )
// }

