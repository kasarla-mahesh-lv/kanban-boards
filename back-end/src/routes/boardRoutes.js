
const router = require("express").Router();
const { 
    createBoard,
    updateBoard,
    getAllBoards,
    getBoardWithDetails,
    deleteBoard
} = require("../controllers/boardController");

router.post("/", createBoard); // POST /api/boards
router.patch("/:id", updateBoard); // PATCH /api/boards/:id
router.get("/", getAllBoards); // This is likely line 7 where the error is
router.get("/:id", getBoardWithDetails);                                 
router.delete("/:id",deleteBoard);// delete api routes


module.exports = router;
