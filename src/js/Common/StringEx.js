
//Changes first letter from string to upper case.
String.prototype.capitalise = function()
{
    var words = this.split(" ");
    var result = "";
    for(var i=0; i<words.length; i++)
    {
        result += words[i].charAt(0).toUpperCase() + words[i].slice(1) + " ";
    }
    return  result;
}
