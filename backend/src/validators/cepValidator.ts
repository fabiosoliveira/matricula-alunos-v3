// cep valid "45.325-256"
export default (v: string):boolean => /^[0-9]{2}.[0-9]{3}-[0-9]{3}$/.test(v)
