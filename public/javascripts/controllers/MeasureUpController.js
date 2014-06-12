function MeasureUpController($scope, $http) {

    //container object model
    function Container(size) {
        this.size = size;
        this.content = 0;
    }
    Container.prototype.empty = function () {
        this.content = 0;
    };
    Container.prototype.isEmpty = function () {
        return this.content == 0 ? true : false;
    };
    Container.prototype.isFull = function () {
        return this.content == this.size ? true : false;
    };
    Container.prototype.fill = function () {
        this.content = this.size;
    };
    Container.prototype.transferTo = function (otherContainer) {
        while (true) {
            if ((otherContainer.content == otherContainer.size) || (this.content == 0)) {
                return;
            }
            this.content -= 1;
            otherContainer.content += 1;
        }
    };

    //make our two container objects
    var containerA = new Container();
    var containerB = new Container();

    //ui event handlers
    $scope.dragstop = function (event, a, b) {
        a.style.borderColor = "";
        b.style.borderColor = "";
    }
    $scope.dragstart = function (event, a, b) {
        if (event.id == "containerA")
            b.style.borderColor = "blue";
        else
            a.style.borderColor = "blue";
    }
    $scope.drop = function (event) {
        if (event.id == "containerA") {
            event.style.borderColor = "";
            containerB.transferTo(containerA);
            $scope.$apply(setContent());
        }
        if (event.id == "containerB") {
            event.style.borderColor = "";
            containerA.transferTo(containerB);
            $scope.$apply(setContent());
        }
    }
    $scope.toggleA = function () {
        containerA.isEmpty() ? containerA.fill() : containerA.empty();
        $scope.$apply(setContent());
    }
    $scope.toggleB = function () {
        containerB.isEmpty() ? containerB.fill() : containerB.empty();
        $scope.$apply(setContent());
    }
    $scope.solve = function () {
        $scope.message = "";

        //todo move this out to rest service
        var statesA = getStates($scope.sizeA, $scope.sizeB, $scope.finalAmount);
        var statesB = getStates($scope.sizeB, $scope.sizeA, $scope.finalAmount);
        if (statesA == null || statesB == null)
        {
            $scope.message = "I just can't do it captain!";
            return;
        }
        $scope.solutionA = "steps\n";
        $scope.solutionB = "steps\n";
        for (key in statesA) {
            var state = statesA[key];
            $scope.solutionA += "[" + state[0] + "," + state[1] + "]\n";
        }
        for (key in statesB) {
            var state = statesB[key];
            $scope.solutionB += "[" + state[1] + "," + state[0] + "]\n";
        }
    }
    $scope.initialize = function () {
        $scope.message = "";
        changeSize();
        $scope.solutionA = null;
        $scope.solutionB = null;
        containerA.size = $scope.sizeA;
        containerB.size = $scope.sizeB;
        $scope.contentA = containerA.content = 0;
        $scope.contentB = containerB.content = 0;
        setContent();
    }

    //update the UI animations
    function setContent() {
        $scope.contentA = containerA.content;
        $scope.contentB = containerB.content;
        var heightA = (containerA.content / containerA.size) * 100;
        var heightB = (containerB.content / containerB.size) * 100;
        var position = "top right";
        if ($scope.waterStyleA != undefined && $scope.waterStyleA["background-position"] == "top right")
            position = "top left";
        if ($scope.waterStyleB != undefined && $scope.waterStyleB["background-position"] == "top right")
            position = "top left";
        $scope.waterStyleA = {"background-position": position, "height": heightA + "%"};
        $scope.waterStyleB = {"background-position": position, "height": heightB + "%"};
        if((containerA.content == $scope.finalAmount) || (containerB.content == $scope.finalAmount))
            setTimeout(function(){alert("Correct!")}, 700);
    }

    //change the size of containers
    function changeSize () {
        //percent of page
        var defaultHeight = 100;
        var defaultWidth = 85;
        var minHeight = 40;
        var minWidth = 30;
        if ($scope.sizeA < $scope.sizeB) {
            var width = (($scope.sizeA / $scope.sizeB) * defaultWidth).toFixed(0);
            if (width < minWidth) width = minWidth;
            var height = (($scope.sizeA / $scope.sizeB) * defaultHeight).toFixed(0);
            if (height < minHeight) height = minHeight;
            $scope.containerStyleA = {"height": height + "%", "width": width + "%"};
            $scope.containerStyleB = {"height": defaultHeight + "%", "width": defaultWidth + "%"};
        }
        else {
            var width = (($scope.sizeB / $scope.sizeA) * defaultWidth).toFixed(0);
            if (width < minWidth) width = minWidth;
            var height = (($scope.sizeB / $scope.sizeA) * defaultHeight).toFixed(0);
            if (height < minHeight) height = minHeight;
            $scope.containerStyleB = {"height": height + "%", "width": width + "%"};
            $scope.containerStyleA = {"height": defaultHeight + "%", "width": defaultWidth + "%"};
        }
    }

    //this can be moved to service
    function getStates(sizeA, sizeB, finalAmount) {
        var states = [];
        var containerA = new Container(sizeA);
        var containerB = new Container(sizeB);
        var finalContent = finalAmount;
        $scope.output = "";
        //containers cant both be smaller than desired amount
        //they cant be the same size
        //final amount must be divisible by gcd of containers
        if ((finalContent > containerA.size && finalContent > containerB.size) ||
            (containerA.size == containerB.size && containerA.size != finalContent) ||
            (finalContent % gcd(containerA.size, containerB.size) != 0)) {
            return null;
        }

        while (true) {
            if ((containerA.content == finalContent) || (containerB.content == finalContent)) {
                return states;
            }
            if (containerA.isEmpty()) {
                containerA.fill();
                states.push([containerA.content, containerB.content]);
            } else if (!containerA.isEmpty() && !containerB.isFull()) {
                containerA.transferTo(containerB);
                states.push([containerA.content, containerB.content]);
            } else if (!containerA.isEmpty() && containerB.isFull()) {
                containerB.empty();
                states.push([containerA.content, containerB.content]);
            }
        }
    }
    //get common denominator
    function gcd(a, b) {
        if (b == 0) {
            return a;
        } else {
            return gcd(b, a % b);
        }
    }

    //initialize game
    $scope.sizeA = 3;
    $scope.sizeB = 5;
    $scope.finalAmount = 4;
    $scope.initialize();
}



