const Trycatch =(handler)=>{
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      console.error("Error in middleware:", error);
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  }
}

export default Trycatch;