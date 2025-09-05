const Tour = require('./../models/tourModel');

//ALIAS
exports.aliasTopTours = (req, res, next)=>{
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};

class APIFeatures{
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }

    filter(){
        const queryObj = {...this.queryString};
        const excludedFields= ['page','sort','limit','fields'];
        excludedFields.forEach(el => delete queryObj[el]);

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        this.query = this.query.find(JSON.parse(queryStr));

        return this; //entire object
    }

    sort(){
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else{
           this.query = this.query.sort('-createdAt');
        }

        return this;
    }

    limitFields(){
        if(this.queryString.fields){
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else{
            this.query = this.query.select('-__v')
        }

        return this;
    }

    paginate(){
        const page = this.queryString.page * 1 || 1; 
        const limit = this.queryString.limit * 1 || 100;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);

        return this;
    }

}

// ROUTES HANDLERS
// GET METHOD
exports.getAllTours = async (req, res) =>{
    try{
        // EXECUTE QUERY
        const features = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        const tours = await features.query;

        res.status(200).json({
            status: 'success',
            results: tours.length,
            data:{
                tours
            }
            
        });

    } catch(err){
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
    
};

// GET METHOD WITH URL PARAMETERS
// :parament
// :optionalParament?
exports.getTour = async (req, res) =>{
    try{
        // Tour.findOne({_id: req.params.id}) 

        const tour = await Tour.findById(req.params.id); // id vem da url

        res.status(200).json({
            status:'success',
            data: {
                tour
            }
        });

    }catch(err){
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};

// POST METHOD
exports.createTour = async (req, res) => {

    try{
    // req.body: data that come from the body request
        const newTour = await Tour.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    } catch(err){
        res.status(404).json({
            status: 'fail',
            message: err
        });

    }
};

// PATH METHOD
exports.updateTour = async (req, res) =>{

    try {

        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        res.status(200).json({
        status : 'success',
        data:{
            tour //tour: tour 
            }
        });
     
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error
        });
    }
}

// DELETE METHOD
exports.deleteTour = async (req, res) =>{
    try {

        await Tour.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status : 'success',
            data: null
        });
        
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error
        });
    }
    

};