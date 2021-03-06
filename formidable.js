function formidable(form, feedback){
    /*
    data-validation-visible=true //validate only visible fields
    data-validation-regex //validate value with regex
    data-validation-not //validate if value is not
    data-validation-fill //validate if field is fill
    data-validation-min/max //validate if value has min or max values
    data-validation-smaller/greater //validate wheter value is smaller or greater
    data-validation-list //validate wheter value is in list
    data-validation-equals //value is equals to other field value
    */

    var invalidate_field = function(field,criteria){
        valid_form = false;
        field.addClass('invalid-field').attr('data-invalid',criteria).parents(parent_selector).first().attr('data-invalid',criteria).addClass('invalid-field');
        console.log('invalid: ',field.attr('name'));
    }

    var reset_field = function(field){
        field.removeClass('invalid-field').removeAttr('data-invalid').parents(parent_selector).first().removeAttr('data-invalid').removeClass('invalid-field');
    }

    form = $(form);
    var validate_field, visible, regex, value, fill, not, min, max, equals, smaller, greater, list, valid, parent_selector, valid_form = true;
    form.find('[data-validate]').each(function(){
        $this = $(this);
        validate_field = true;
        visible = $this.attr('data-validate-visible');
        if(visible && !$this.is(':visible')) validate_field = false;

        if(validate_field){
            target = $($this.attr('data-validate-target'));
            parent_selector = $this.attr('data-validate');
            reset_field($this);
            valid = true;
            value = target.length > 0 ? target.val() : $this.val();

            if($this.is('input')){
                type = $this.attr('type');
                if(!type) type = 'text';
            }else $this.prop("tagName").toLowerCase();

            regex = $this.attr('data-validate-regex');
            if(regex){
                regex = new RegExp(regex);
                valid = regex.test(value);

                if(!valid){
                    invalidate_field($this,'regex');
                    return true;
                }
            }

            fill = $this.attr('data-validate-fill');
            if(fill){
                valid = value.split(' ').join('').split("\n").join('') != '';

                if(!valid){
                    invalidate_field($this,'fill');
                    return true;
                }
            }

            min = $this.attr('data-validate-min');
            if(min){
                if(type == 'text' || type == 'textarea') valid = value.length >= min;
                else  valid = value >= min;

                if(!valid){
                    invalidate_field($this,'min');
                    return true;
                }
            }

            max = $this.attr('data-validate-max');
            if(max){
                if(type == 'text' || type == 'textarea') valid = value.length <= max;
                else valid = value <= max;

                if(!valid){
                    invalidate_field($this,'max');
                    return true;
                }
            }

            not = $this.attr('data-validate-not');
            if(not){
                valid = value != not;
                if(!valid){
                    invalidate_field($this,'not');
                    return true;
                }
            }

            greater = $this.attr('data-validate-greater');
            if(greater){
                if(type == 'text' || type == 'textarea') valid = value.length > greater;
                else valid = value > greater;

                if(!valid){
                    invalidate_field($this,'greater');
                    return true;
                }
            }

            smaller = $this.attr('data-validate-smaller');
            if(smaller){
                if(type == 'text' || type == 'textarea') valid = value.length < smaller;
                else valid = value < smaller;

                if(!valid){
                    invalidate_field($this,'smaller');
                    return true;
                }
            }

            list = $this.attr('data-validate-list');
            if(list){
                list = list.explode(',');
                valid = false;
                for(var k in list){
                    if(list[k] == value){ valid = true; break }
                }

                if(!valid){
                    invalidate_field($this,'list');
                    return true;
                }
            }

            equals = $this.attr('data-validate-equals');
            if(equals){
                equals = form.find(equals);
                if(equals.length){
                    reset_field(equals);
                    valid = equals.val() == value;

                    if(!valid){
                        invalidate_field($this,'equals');
                        invalidate_field(equals,'equals');
                        return true;
                    }
                }
            }
        }
    });

    if(!valid_form){
        if(feedback) setTimeout(function(){ alert(feedback); }, 50);
        // $("html, body").stop().animate({scrollTop:form.find('.invalid-field').first().offset().top - 50}, '500', 'swing');
        return false;
    }

    return true;
}
