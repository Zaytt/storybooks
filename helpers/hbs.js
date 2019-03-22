const moment = require('moment');

module.exports = {
  truncate: function (str, len){
    if(str.length > len && str.length > 0){
      let newStr = str + " ";
      newStr = str.substr(0, len);
      newStr = str.substr(0, newStr.lastIndexOf(" "));
      newStr = newStr.length > 0 ? newStr : str.substr(0, len);
      return `${newStr}...`;
    } else {
      return str;
    }
  },
  stripHTMLTags: function (input){
    return input.replace(/<(?:.|\n)*?>/gm, '');
  }, 
  formatDate: function (date, format){
    return moment(date).format(format);
  },
  select: function(selected, options){
    return options.fn(this).replace( new RegExp(' value=\"' + selected + '\"'), '$& selected="selected"').replace( new RegExp('>' + selected + '</option>'), ' selected="selected"$&');
  }, 
  editIcon: function(storyUser, loggedUser, storyId, floating = true){
    if(storyUser == loggedUser){
      if(floating){
        return `<a href="/stories/edit/${storyId}" class="btn-floating halfway-fab"><i class="fa fa-pencil" ></i></a>` 
      } else {
        return `<a href="/stories/edit/${storyId}" ><i class="fa fa-pencil" ></i></a>` 
      }
    } else {
      return '';
    }
  },
  compare: function(lvalue, rvalue, options) {

		if (arguments.length < 3)
			throw new Error("Handlerbars Helper 'compare' needs 2 parameters");

		operator = options.hash.operator || "==";
		
		var operators = {
			'==':		function(l,r) { return l == r; },
			'===':	function(l,r) { return l === r; },
			'!=':		function(l,r) { return l != r; },
			'<':		function(l,r) { return l < r; },
			'>':		function(l,r) { return l > r; },
			'<=':		function(l,r) { return l <= r; },
			'>=':		function(l,r) { return l >= r; },
			'typeof':	function(l,r) { return typeof l == r; }
		}

		if (!operators[operator])
			throw new Error("Handlerbars Helper 'compare' doesn't know the operator "+operator);

		var result = operators[operator](lvalue,rvalue);

		if( result ) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
		
  }
}