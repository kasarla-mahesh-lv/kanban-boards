
const router = require("express").Router();
const { 
    createBoard,
    updateBoard,
    getAllBoards,
    getBoardWithDetails,
    deleteBoard
} = require("../controllers/boardController");
const authMiddleware = require("../middlewares/authmiddlewares");

router.post("/", authMiddleware, createBoard); // POST /api/boards
router.patch("/:id",authMiddleware, updateBoard); // PATCH /api/boards/:id
router.get("/",authMiddleware, getAllBoards); 
router.get("/:id",authMiddleware, getBoardWithDetails);                                 
router.delete("/:id",authMiddleware,deleteBoard);// delete api routes


module.exports = router;
