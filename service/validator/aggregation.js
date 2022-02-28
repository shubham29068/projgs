class AggregationService{
    constructor() { }
    lookup(from,_let,matchWithAndOpr,fieldName){
        return {
            $lookup: {
                from: from,
                let: _let,
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: matchWithAndOpr,
                            },
                        },
                    },
                ],
                as: fieldName
            }
        }
    }
}
module.exports = AggregationService