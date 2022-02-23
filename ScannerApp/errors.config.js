
const config = {
errors : [
    {
        code :'OK',
        msg : 'Operation war erfolgreich'
    },
    {
        code: 'not found',
        msg: 'the EAN could not be found',
    },
    {
        code: 'checksum',
        msg: 'the EAN was incorrect (checksum error)'
    },
    {
        code: 'EAN-format',
        msg: 'the EAN was incorrect (invalid format / incorrect number of digits)'
    },
    {
        code: 'not a global',
        msg: 'an EAN reserved for internal applications was entered (in-store, coupon, etc.)'
    },
    {
        code: 'access limit exceeded',
        msg: 'Access limit to the database has been exceeded'
    },
    {
        code: 'no product name',
        msg: 'no product name was specified'
    },
    {
        code: 'product name too long',
        msg: 'the product name is too long (max. 20 characters)'
    },
    {
        code: 'no or wrong main category id',
        msg: 'the number for the main category is missing or outside the allowed range'
    },
    {
        code: 'no or wrong sub category id',
        msg: 'the number for the associated sub category is missing or outside the allowed range'
    },
    {
        code: 'illegal data in vendor field',
        msg: 'illegal data in vendor field'
    },
    {
        code: 'illegal data in description field',
        msg: 'illegal data in description field'
    },
    {
        code: 'data already submitted',
        msg: 'data has already been submitted'
    },
    {
        code: 'queryid missing or wrong',
        msg: 'the UserID/queryid is missing in the query or is not activated for this function'
    },
    {
        code: 'unknown command',
        msg: 'an unknown command was passed with the "cmd" parameter'
    }
]
}

export default config