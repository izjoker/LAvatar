import _ from 'lodash';
import mongoose, {Connection, Schema, Model, Document} from 'mongoose';
import bcrypt from 'bcrypt';
import ERR from 'http-errors';
import jwtHelper from '../../utils/jwtHelper';
import log from '../../utils/logger';


const SALT_WORK_FACTOR = 10;

const schemaName = 'User';

const schema = new Schema<UserDocument, UserModel>(
    {
        email: {type: String, unique: true, required: true},
        username: {type: String},
        password: {type: String, select: false},
        last_login: {type: Date},
        profile_img: {type: String},
        settings: {type: Object},
        permissions: {type: [String], select: false},
    },
    {
        timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'},
        toJSON: {virtuals: true},
    },
);

interface User {
    email: string;
    username: string;
    password?: string;
    last_login?: Date;
    profile_img: string;
    settings?: UserSettings;
    permissions: object;

}
interface UserSettings {
    locale?: string;
    timezone?: string;
}
export interface UserDocument extends User, Document {

    comparePassword(candidatePassword: string): Promise<boolean>;

    createAuthToken(withPermission?: any): string;
}

export interface UserModel extends Model<UserDocument> {
    getUser(email: string, password: string): any;

    jwt_authenticate(email: string, password: string): any;
}


// Instance methods
schema.methods.comparePassword = async function(candidatePassword: string) {
    console.log('check password', candidatePassword, this.password);
    const isMatch = await bcrypt.compare(candidatePassword, this.password as string);
    console.log('isMatch', isMatch);

    return isMatch;
};

schema.methods.createAuthToken = function(withPermission: string) {
    const omitList = ['password'];
    if (!withPermission) {
        omitList.push('permissions');
    } else {
        log.warning('createAuthToken with permissions');
    }
    const payload = _.omit(this.toJSON(), omitList);
    return jwtHelper.sign(payload);
};

// Static methods
schema.statics.getUser = async function(email, password) {
    const user = await this.jwt_authenticate(email, password);
    if (!user) {
        throw ERR(404, 'cannot found user');
    } else {
        return user;
    }
};

schema.statics.jwt_authenticate = async function(email, password) {
    const user = await this.findOne({email: email}).select('password');
    if (!user) {
        throw ERR(400, 'cannot found user by email');
    }
    if (bcrypt.compareSync(password, user.password as string)) {
        console.log('success password is correct');
        return _.omit(user.toJSON(), 'password');
    } else {
        throw ERR(400, 'password is wrong');
    }
};

schema.statics.createGuestUser = async function(req) {
    const ip = _.get(req, 'originalUrl');
    if (ip) {
        const existGuest = await this.findOne({isGuest: ip});
        const pass = Math.random().toString(36).substring(8);
        if (existGuest) {
            return null;
        } else {
            const oid = new mongoose.Types.ObjectId().toString();
            const newGuest = new this({
                username: `Guest-${oid}`,
                email: `Guest@${oid}.com`,
                password: pass,
            });
            let guest: UserDocument | null = await newGuest.save();
            guest = await this.findById(guest._id);
            const guestInfo: any = _.pick(guest, ['email', 'username']);
            guestInfo.password = pass;
            return {
                guest: guestInfo,
                token: guest!.createAuthToken(),
            };
        }
    }
};

// Hooks
// @see: http://devsmash.com/blog/password-authentication-with-mongoose-and-bcrypt
schema.pre('save', function(next) {
    const user: UserDocument = this;
    if (!user.username) {
        user.username = _.get(user.email.match(/^([^@]*)@/), '1')!;
    }

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password along with our new salt
        bcrypt.hash(user.password!, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});
export default function(connection: Connection) {
    return (connection || mongoose).model<UserDocument, UserModel>(schemaName, schema, schemaName);
}
